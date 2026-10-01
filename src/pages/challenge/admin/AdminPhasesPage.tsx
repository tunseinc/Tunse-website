import { EditOutlined } from "@ant-design/icons"
import { Alert, Button, DatePicker, Descriptions, Drawer, Form, Input, InputNumber, Switch, Table, Tabs, Tooltip } from "antd"
import type { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"
import { useState } from "react"
import { PhaseBadge } from "../../../components/challenge/shared/PhaseBadge"
import { useAuthStore } from "../../../stores/authStore"
import { usePhases, useUpdatePhase } from "../../../features/challenge/phases/usePhases"
import { useClaimTypesForPhase, useUpdateClaimType } from "../../../features/challenge/claimTypes/useClaimTypes"
import type { ClaimType } from "../../../lib/api/claimTypes"
import type { Phase } from "../../../lib/api/phases"
import useDocumentHead from "../../../hooks/use-document-head"

interface PhaseFormValues {
    name: string
    dateRange: [dayjs.Dayjs, dayjs.Dayjs]
    prizeText: string
    rulesVersion: string
}

function PhaseTabContent({ phase, canManage }: { phase: Phase; canManage: boolean }) {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [form] = Form.useForm<PhaseFormValues>()
    const { data: claimTypes = [] } = useClaimTypesForPhase(phase.id)
    const updatePhaseMutation = useUpdatePhase()
    const updateClaimTypeMutation = useUpdateClaimType()

    const openDrawer = () => {
        form.setFieldsValue({
            name: phase.name,
            dateRange: [dayjs(phase.starts_at), dayjs(phase.ends_at)],
            prizeText: phase.prize_text ?? "",
            rulesVersion: phase.rules_version,
        })
        setDrawerOpen(true)
    }

    const handleSave = async () => {
        const values = await form.validateFields()
        updatePhaseMutation.mutate(
            {
                id: phase.id,
                payload: {
                    name: values.name,
                    starts_at: values.dateRange[0].format("YYYY-MM-DD"),
                    ends_at: values.dateRange[1].format("YYYY-MM-DD"),
                    prize_text: values.prizeText,
                    rules_version: values.rulesVersion,
                },
            },
            { onSuccess: () => setDrawerOpen(false) },
        )
    }

    const hasTbdPoints = claimTypes.some((ct) => ct.base_points === null)

    const claimTypeColumns: ColumnsType<ClaimType> = [
        { title: "Code", dataIndex: "code" },
        { title: "Label", dataIndex: "label" },
        {
            title: "Base points",
            render: (_, ct) => (
                <Tooltip title={!canManage ? "Only Admin/Super Admin can edit scoring." : ""}>
                    <InputNumber
                        defaultValue={ct.base_points ?? undefined}
                        placeholder="TBD"
                        min={0}
                        disabled={!canManage}
                        onBlur={(e) => {
                            const raw = e.target.value.trim()
                            const val = Number(raw)
                            updateClaimTypeMutation.mutate({
                                id: ct.id,
                                payload: { base_points: raw === "" || Number.isNaN(val) ? null : val },
                            })
                        }}
                    />
                </Tooltip>
            ),
        },
        {
            title: "Active",
            render: (_, ct) => (
                <Switch
                    checked={ct.active}
                    disabled={!canManage}
                    onChange={(checked) => updateClaimTypeMutation.mutate({ id: ct.id, payload: { active: checked } })}
                />
            ),
        },
        { title: "Validation rule", dataIndex: "validation_rule_text", width: 320 },
    ]

    return (
        <div className="flex flex-col gap-4">
            <Descriptions
                bordered
                size="small"
                column={{ xs: 1, md: 2 }}
                title="Phase details"
                extra={
                    <Tooltip title={!canManage ? "Auditors cannot edit phases. Switch to Admin or Super Admin." : ""}>
                        <Button icon={<EditOutlined />} onClick={openDrawer} disabled={!canManage}>
                            Edit
                        </Button>
                    </Tooltip>
                }
            >
                <Descriptions.Item label="Name">{phase.name}</Descriptions.Item>
                <Descriptions.Item label="Number">{phase.number === 0 ? "Continuous track" : phase.number}</Descriptions.Item>
                <Descriptions.Item label="Status">
                    <PhaseBadge status={phase.status} />
                </Descriptions.Item>
                <Descriptions.Item label="Rules version">{phase.rules_version}</Descriptions.Item>
                <Descriptions.Item label="Start">{new Date(phase.starts_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</Descriptions.Item>
                <Descriptions.Item label="End">{new Date(phase.ends_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</Descriptions.Item>
                <Descriptions.Item label="Prize" span={2}>
                    {phase.prize_text}
                </Descriptions.Item>
            </Descriptions>

            {hasTbdPoints && (
                <Alert
                    type="info"
                    showIcon
                    message="Some claim types have points pending finalization"
                    description="Points marked TBD are intentionally left unconfigured pending pilot calibration, per the dev spec. They can be set here once finalized."
                />
            )}

            <Table
                rowKey="id"
                title={() => "Claim types"}
                columns={claimTypeColumns}
                dataSource={claimTypes}
                pagination={false}
                scroll={{ x: true }}
                size="small"
            />

            <Drawer title={`Edit ${phase.name}`} open={drawerOpen} onClose={() => setDrawerOpen(false)} width={420}>
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="name" label="Phase name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="dateRange" label="Start / End" rules={[{ required: true }]}>
                        <DatePicker.RangePicker className="w-full" />
                    </Form.Item>
                    <Form.Item name="prizeText" label="Prize text" rules={[{ required: true }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="rulesVersion" label="Rules version" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={updatePhaseMutation.isPending}>
                        Save changes
                    </Button>
                </Form>
            </Drawer>
        </div>
    )
}

export default function AdminPhasesPage() {
    useDocumentHead({ title: "Phases & Scoring — Tunse Challenge Admin" })
    const role = useAuthStore((s) => s.user?.role)
    const { data: phases = [] } = usePhases()
    const canManage = role !== "auditor"

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-xl font-semibold mb-4">Phases & Scoring</h1>
            {!canManage && (
                <Alert
                    type="info"
                    showIcon
                    className="mb-4"
                    message="Read-only for your role"
                    description="Auditors can review phase and scoring details but cannot edit them. Switch to Admin or Super Admin to manage phases."
                />
            )}
            <Tabs
                items={phases.map((phase) => ({
                    key: String(phase.id),
                    label: phase.name,
                    children: <PhaseTabContent phase={phase} canManage={canManage} />,
                }))}
            />
        </div>
    )
}
