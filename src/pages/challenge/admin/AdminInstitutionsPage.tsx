import { FlagOutlined, PlusOutlined } from "@ant-design/icons"
import { Alert, Button, Card, Empty, Form, Grid, Input, List, Modal, Select, Space, Switch, Table, Tag, Tooltip } from "antd"
import type { ColumnsType } from "antd/es/table"
import { useMemo, useState } from "react"
import { DisqualifyModal } from "../../../components/challenge/admin/DisqualifyModal"
import { useAuthStore } from "../../../stores/authStore"
import { useCreateInstitution, useInstitutions, useUpdateInstitution } from "../../../features/challenge/institutions/useInstitutions"
import { useActivePhase } from "../../../features/challenge/phases/usePhases"
import { useInstitutionLeaderboard } from "../../../features/challenge/leaderboards/useLeaderboards"
import { useStates } from "../../../features/challenge/reference/useReference"
import useDocumentHead from "../../../hooks/use-document-head"

const { useBreakpoint } = Grid

interface AddInstitutionValues {
    name: string
    short_code: string
    state: string
    coordinator_name?: string
}

export default function AdminInstitutionsPage() {
    useDocumentHead({ title: "Institutions — Tunse Challenge Admin" })
    const screens = useBreakpoint()
    const role = useAuthStore((s) => s.user?.role)
    const { data: institutions = [] } = useInstitutions()
    const { data: states = [] } = useStates()
    const canManage = role !== "auditor"

    const [search, setSearch] = useState("")
    const [addOpen, setAddOpen] = useState(false)
    const [disqualifyTarget, setDisqualifyTarget] = useState<number | null>(null)
    const [form] = Form.useForm<AddInstitutionValues>()

    const { data: phase } = useActivePhase()
    const { data: leaderboard } = useInstitutionLeaderboard(phase?.id)
    const createMutation = useCreateInstitution()
    const updateMutation = useUpdateInstitution()

    const rows = useMemo(
        () =>
            institutions
                .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
                .map((inst) => {
                    const row = leaderboard?.data.find((r) => r.institution_id === inst.id)
                    return {
                        institution: inst,
                        participantCount: inst.participant_count ?? 0,
                        score: row?.provisional_score ?? 0,
                        rank: row?.rank,
                    }
                }),
        [institutions, search, leaderboard],
    )

    const handleAdd = async () => {
        const values = await form.validateFields()
        createMutation.mutate(values, {
            onSuccess: () => {
                form.resetFields()
                setAddOpen(false)
            },
        })
    }

    const columns: ColumnsType<(typeof rows)[number]> = [
        {
            title: "Institution",
            render: (_, r) => (
                <div>
                    <div className="font-medium">{r.institution.name}</div>
                    <div className="text-xs text-gray-500">{r.institution.short_code}</div>
                </div>
            ),
        },
        { title: "State", dataIndex: ["institution", "state"], responsive: ["md"] },
        {
            title: "Coordinator",
            render: (_, r) => r.institution.coordinator_name ?? <span className="text-gray-400">Not assigned</span>,
            responsive: ["lg"],
        },
        { title: "Participants", dataIndex: "participantCount", responsive: ["md"] },
        {
            title: `${phase?.name ?? "Phase"} score`,
            render: (_, r) => (r.rank ? `#${r.rank} · ${r.score} pts` : `${r.score} pts`),
        },
        {
            title: "Active",
            render: (_, r) => (
                <Tooltip title={!canManage ? "Only Admin/Super Admin can change institution status." : ""}>
                    <Switch
                        checked={r.institution.active}
                        disabled={!canManage}
                        onChange={(checked) => updateMutation.mutate({ id: r.institution.id, payload: { active: checked } })}
                    />
                </Tooltip>
            ),
        },
        {
            title: "Actions",
            render: (_, r) => (
                <Tooltip title={!canManage ? "Only Admin/Super Admin can disqualify an institution." : ""}>
                    <Button
                        size="small"
                        danger
                        icon={<FlagOutlined />}
                        disabled={!canManage}
                        onClick={() => setDisqualifyTarget(r.institution.id)}
                    >
                        Disqualify
                    </Button>
                </Tooltip>
            ),
        },
    ]

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h1 className="text-xl font-semibold m-0">Institutions</h1>
                <Tooltip title={!canManage ? "Only Admin/Super Admin can add institutions." : ""}>
                    <Button type="primary" icon={<PlusOutlined />} disabled={!canManage} onClick={() => setAddOpen(true)}>
                        Add institution
                    </Button>
                </Tooltip>
            </div>

            {!canManage && (
                <Alert
                    type="info"
                    showIcon
                    className="mb-4"
                    message="Read-only for your role"
                    description="Auditors can view institution standings but cannot change active status, add institutions, or disqualify them."
                />
            )}

            <Space wrap className="mb-4">
                <Input.Search
                    placeholder="Search institution name"
                    allowClear
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 240 }}
                />
            </Space>

            {!rows.length ? (
                <Empty description="No institutions match your search" />
            ) : screens.md ? (
                <Table rowKey={(r) => r.institution.id} columns={columns} dataSource={rows} pagination={{ pageSize: 10 }} scroll={{ x: true }} />
            ) : (
                <List
                    dataSource={rows}
                    renderItem={(r) => (
                        <List.Item>
                            <Card className="w-full" size="small">
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <div className="font-medium">{r.institution.name}</div>
                                        <div className="text-xs text-gray-500">
                                            {r.institution.state} · {r.institution.coordinator_name ?? "No coordinator"}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {r.participantCount} participants · {r.score} pts
                                        </div>
                                    </div>
                                    <Tag color={r.institution.active ? "success" : "default"}>
                                        {r.institution.active ? "Active" : "Inactive"}
                                    </Tag>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            )}

            <Modal
                title="Add institution"
                open={addOpen}
                onCancel={() => setAddOpen(false)}
                onOk={handleAdd}
                confirmLoading={createMutation.isPending}
                okText="Add institution"
                destroyOnHidden
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Institution name" rules={[{ required: true, message: "Name is required." }]}>
                        <Input placeholder="e.g. University of Abuja" />
                    </Form.Item>
                    <Form.Item name="short_code" label="Short code" rules={[{ required: true, message: "Short code is required." }]}>
                        <Input placeholder="e.g. UNIABUJA" />
                    </Form.Item>
                    <Form.Item name="state" label="State" rules={[{ required: true, message: "State is required." }]}>
                        <Select showSearch options={states.map((s) => ({ value: s.state, label: s.state }))} placeholder="Select state" />
                    </Form.Item>
                    <Form.Item name="coordinator_name" label="Coordinator name (optional)">
                        <Input placeholder="e.g. Dr. Jane Doe" />
                    </Form.Item>
                </Form>
            </Modal>

            <DisqualifyModal
                open={!!disqualifyTarget}
                onClose={() => setDisqualifyTarget(null)}
                defaultTargetType="institution"
                defaultTargetId={disqualifyTarget ?? undefined}
            />
        </div>
    )
}
