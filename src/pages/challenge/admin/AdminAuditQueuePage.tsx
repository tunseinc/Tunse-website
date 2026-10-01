import { Alert, Card, Empty, Grid, List, Select, Space, Spin, Table } from "antd"
import type { ColumnsType } from "antd/es/table"
import { useState } from "react"
import { useNavigate } from "react-router"
import { RiskFlagTag } from "../../../components/challenge/admin/RiskFlagTag"
import { RISK_META, type RiskReason } from "../../../components/challenge/admin/riskFlags"
import { ClaimStatusTag } from "../../../components/challenge/shared/ClaimStatusTag"
import { useAdminClaims } from "../../../features/challenge/claims/useClaims"
import { usePhases } from "../../../features/challenge/phases/usePhases"
import useDocumentHead from "../../../hooks/use-document-head"

const { useBreakpoint } = Grid

export default function AdminAuditQueuePage() {
    useDocumentHead({ title: "Audit Queue — Tunse Challenge Admin" })
    const navigate = useNavigate()
    const screens = useBreakpoint()
    const { data: phases = [] } = usePhases()
    const [reasonFilter, setReasonFilter] = useState<RiskReason | "all">("all")

    const { data, isLoading } = useAdminClaims({
        risk_reason: reasonFilter === "all" ? undefined : reasonFilter,
        sort: "risk",
    })
    const claims = (data?.data ?? []).filter((c) => (c.risk_reasons ?? []).length > 0)

    const columns: ColumnsType<(typeof claims)[number]> = [
        {
            title: "Student",
            render: (_, c) => <div className="font-medium">{c.student_name ?? "Unknown"}</div>,
        },
        { title: "Claim type", render: (_, c) => c.claim_type?.label, responsive: ["md"] },
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
            title: "Risk reasons",
            render: (_, c) => (
                <div className="flex flex-wrap gap-1">
                    {(c.risk_reasons ?? []).map((reason) => (
                        <RiskFlagTag key={reason} reason={reason as RiskReason} />
                    ))}
                </div>
            ),
        },
    ]

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-xl font-semibold mb-2">Audit Priority Queue</h1>
            <Alert
                type="info"
                showIcon
                className="mb-4"
                message="Sorted by risk"
                description="Highest-risk claims first — students entering the national or institution top ranks, institutions in a prize-contending position, unusually fast claim velocity, duplicate recruit phones, and manually flagged claims. Before prize payment, the spec requires a 100% audit of all claims supporting the winning score, with the leaderboard frozen during final validation."
            />

            <Space wrap className="mb-4">
                <Select
                    value={reasonFilter}
                    onChange={setReasonFilter}
                    style={{ width: 260 }}
                    options={[
                        { value: "all", label: "All risk reasons" },
                        ...(Object.keys(RISK_META) as RiskReason[]).map((r) => ({ value: r, label: RISK_META[r].label })),
                    ]}
                />
            </Space>

            {isLoading ? (
                <Spin />
            ) : !claims.length ? (
                <Empty description="No claims currently flagged as high-risk." />
            ) : screens.md ? (
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={claims}
                    pagination={{ pageSize: 10 }}
                    onRow={(c) => ({
                        onClick: () => navigate(`/challenge/admin/claims/${c.id}`),
                        className: "cursor-pointer",
                    })}
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
                                        <div className="text-xs text-gray-500">{c.student_name}</div>
                                    </div>
                                    <ClaimStatusTag status={c.status} />
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {(c.risk_reasons ?? []).map((reason) => (
                                        <RiskFlagTag key={reason} reason={reason as RiskReason} />
                                    ))}
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            )}
            <p className="w-full mx-auto text-xs text-gray-400 mt-4 text-center lg:max-w-md">
                Phases considered: {phases.map((p) => p.name).join(", ")}.
            </p>
        </div>
    )
}
