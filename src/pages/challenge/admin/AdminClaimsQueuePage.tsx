import { Button, Card, Empty, Grid, Input, List, Popconfirm, Select, Space, Spin, Table, Tag } from "antd"
import type { ColumnsType } from "antd/es/table"
import { useState } from "react"
import { useNavigate } from "react-router"
import { RiskFlagTag } from "../../../components/challenge/admin/RiskFlagTag"
import type { RiskReason } from "../../../components/challenge/admin/riskFlags"
import { ClaimStatusTag } from "../../../components/challenge/shared/ClaimStatusTag"
import { useAdminClaims, useReviewClaim } from "../../../features/challenge/claims/useClaims"
import { usePhases } from "../../../features/challenge/phases/usePhases"
import useDocumentHead from "../../../hooks/use-document-head"
import type { Claim } from "../../../lib/api/claims"

const { useBreakpoint } = Grid

export default function AdminClaimsQueuePage() {
    useDocumentHead({ title: "Claims Queue — Tunse Challenge Admin" })
    const navigate = useNavigate()
    const screens = useBreakpoint()
    const { data: phases = [] } = usePhases()

    const [phaseFilter, setPhaseFilter] = useState<number | "all">("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [search, setSearch] = useState("")
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

    const { data, isLoading } = useAdminClaims({
        phase_id: phaseFilter === "all" ? undefined : phaseFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: search || undefined,
        sort: "risk",
    })
    const claims = data?.data ?? []
    const reviewMutation = useReviewClaim()

    const selectedClaims = claims.filter((c) => selectedRowKeys.includes(c.id))

    const applyBulk = (outcome: "verified" | "rejected") => {
        const note =
            outcome === "verified"
                ? "Bulk verified via Claims Queue bulk action."
                : "Bulk rejected via Claims Queue bulk action."
        selectedClaims.forEach((c) => reviewMutation.mutate({ id: c.id, payload: { outcome, audit_notes: note } }))
        setSelectedRowKeys([])
    }

    const columns: ColumnsType<Claim> = [
        {
            title: "Student",
            render: (_, c) => (
                <div>
                    <div className="font-medium">{c.student_name ?? "Unknown"}</div>
                </div>
            ),
        },
        {
            title: "Phase",
            render: (_, c) => phases.find((p) => p.id === c.phase_id)?.name,
            responsive: ["lg"],
        },
        { title: "Claim type", render: (_, c) => c.claim_type?.label },
        {
            title: "Recruit",
            render: (_, c) => (
                <div>
                    <div>{c.recruit_name}</div>
                    <div className="text-xs text-gray-500">{c.recruit_phone}</div>
                </div>
            ),
        },
        { title: "Status", render: (_, c) => <ClaimStatusTag status={c.status} /> },
        {
            title: "Risk",
            render: (_, c) => (
                <div className="flex flex-wrap gap-1">
                    {(c.risk_reasons ?? []).map((r) => (
                        <RiskFlagTag key={r} reason={r as RiskReason} />
                    ))}
                </div>
            ),
        },
        {
            title: "Submitted",
            dataIndex: "created_at",
            render: (v: string) => new Date(v).toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
            responsive: ["md"],
        },
    ]

    const toolbar = (
        <Space wrap className="mb-4">
            <Input.Search
                placeholder="Search recruit, phone, or student"
                allowClear
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 240 }}
            />
            <Select
                value={phaseFilter}
                onChange={setPhaseFilter}
                style={{ width: 200 }}
                options={[{ value: "all", label: "All phases" }, ...phases.map((p) => ({ value: p.id, label: p.name }))]}
            />
            <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 190 }}
                options={[
                    { value: "all", label: "All statuses" },
                    { value: "submitted", label: "Pending / Unaudited" },
                    { value: "verified", label: "Verified" },
                    { value: "rejected", label: "Rejected" },
                    { value: "flagged", label: "Flagged" },
                    { value: "correction_requested", label: "Correction Requested" },
                ]}
            />
        </Space>
    )

    const bulkBar = selectedRowKeys.length > 0 && (
        <Card size="small" className="mb-4 !bg-[#EEFFE2]">
            <div className="flex flex-wrap items-center gap-2 justify-between">
                <span className="text-sm font-medium">{selectedRowKeys.length} claim(s) selected</span>
                <Space wrap>
                    <Popconfirm
                        title={`Verify ${selectedRowKeys.length} claim(s)?`}
                        description="This applies a bulk verification note to each selected claim."
                        onConfirm={() => applyBulk("verified")}
                    >
                        <Button type="primary" size="small">
                            Bulk Verify
                        </Button>
                    </Popconfirm>
                    <Popconfirm
                        title={`Reject ${selectedRowKeys.length} claim(s)?`}
                        description="This applies a bulk rejection note to each selected claim."
                        onConfirm={() => applyBulk("rejected")}
                    >
                        <Button danger size="small">
                            Bulk Reject
                        </Button>
                    </Popconfirm>
                </Space>
            </div>
        </Card>
    )

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-xl font-semibold mb-4">Claims Queue</h1>
            {toolbar}
            {bulkBar}
            {isLoading ? (
                <Spin />
            ) : !claims.length ? (
                <Empty description="No claims match your filters" />
            ) : screens.md ? (
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={claims}
                    rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                    onRow={(record) => ({
                        onClick: () => navigate(`/challenge/admin/claims/${record.id}`),
                        className: "cursor-pointer",
                    })}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: true }}
                />
            ) : (
                <List
                    dataSource={claims}
                    renderItem={(c) => (
                        <List.Item onClick={() => navigate(`/challenge/admin/claims/${c.id}`)}>
                            <Card className="w-full" size="small">
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <div className="font-medium">{c.recruit_name}</div>
                                        <div className="text-xs text-gray-500">
                                            {c.student_name} · {c.claim_type?.label}
                                        </div>
                                    </div>
                                    <ClaimStatusTag status={c.status} />
                                </div>
                                {(c.risk_reasons ?? []).length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {(c.risk_reasons ?? []).map((r) => (
                                            <RiskFlagTag key={r} reason={r as RiskReason} />
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </List.Item>
                    )}
                />
            )}
            {!screens.md && selectedRowKeys.length > 0 && (
                <Tag className="mt-2">Bulk selection is available on wider screens.</Tag>
            )}
        </div>
    )
}
