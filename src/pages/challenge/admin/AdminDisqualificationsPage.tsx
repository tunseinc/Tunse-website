import { PlusOutlined } from "@ant-design/icons"
import { Alert, Button, Card, Col, Empty, Grid, List, Popconfirm, Row, Table, Tag, Timeline, Tooltip } from "antd"
import type { ColumnsType } from "antd/es/table"
import { useQueries } from "@tanstack/react-query"
import { useState } from "react"
import { DisqualifyModal } from "../../../components/challenge/admin/DisqualifyModal"
import { ScoreAdjustmentModal } from "../../../components/challenge/admin/ScoreAdjustmentModal"
import { useAuthStore } from "../../../stores/authStore"
import {
    useDisqualifications,
    useReinstateDisqualification,
} from "../../../features/challenge/disqualifications/useDisqualifications"
import { useScoreAdjustments } from "../../../features/challenge/scoreAdjustments/useScoreAdjustments"
import { usePhases } from "../../../features/challenge/phases/usePhases"
import { useInstitutions } from "../../../features/challenge/institutions/useInstitutions"
import { fetchIndividualLeaderboard } from "../../../lib/api/leaderboards"
import { queryKeys } from "../../../lib/queryKeys"
import type { Disqualification } from "../../../lib/api/disqualifications"
import type { ScoreAdjustment } from "../../../lib/api/scoreAdjustments"
import useDocumentHead from "../../../hooks/use-document-head"

export default function AdminDisqualificationsPage() {
    useDocumentHead({ title: "Disqualifications — Tunse Challenge Admin" })
    const screens = Grid.useBreakpoint()
    const role = useAuthStore((s) => s.user?.role)
    const canManage = role !== "auditor"

    const { data: disqualifications = [] } = useDisqualifications()
    const { data: scoreAdjustments = [] } = useScoreAdjustments()
    const { data: phases = [] } = usePhases()
    const { data: institutions = [] } = useInstitutions()
    const reinstateMutation = useReinstateDisqualification()

    const phaseIds = [...new Set([...disqualifications, ...scoreAdjustments].map((r) => r.phase_id))]
    const leaderboardQueries = useQueries({
        queries: phaseIds.map((phaseId) => ({
            queryKey: queryKeys.leaderboards.individual(phaseId, undefined, "provisional"),
            queryFn: () => fetchIndividualLeaderboard(phaseId, undefined, "provisional"),
        })),
    })
    const userNames = new Map<number, string>()
    leaderboardQueries.forEach((q) => q.data?.data.forEach((row) => userNames.set(row.user_id, row.full_name)))

    const resolveTargetName = (targetType: "user" | "institution", targetId: number) =>
        targetType === "institution"
            ? institutions.find((i) => i.id === targetId)?.name ?? "Unknown institution"
            : userNames.get(targetId) ?? `Student #${targetId}`

    const [disqualifyOpen, setDisqualifyOpen] = useState(false)
    const [adjustOpen, setAdjustOpen] = useState(false)

    const sortedDisqualifications = [...disqualifications].sort((a, b) => b.created_at.localeCompare(a.created_at))
    const sortedAdjustments = [...scoreAdjustments].sort((a, b) => b.created_at.localeCompare(a.created_at))

    const columns: ColumnsType<Disqualification> = [
        {
            title: "Target",
            render: (_, d) => (
                <div>
                    <div className="font-medium">{resolveTargetName(d.targetable_type, d.targetable_id)}</div>
                    <div className="text-xs text-gray-500 capitalize">{d.targetable_type}</div>
                </div>
            ),
        },
        { title: "Phase", render: (_, d) => phases.find((p) => p.id === d.phase_id)?.name, responsive: ["md"] },
        { title: "Reason", dataIndex: "reason" },
        {
            title: "Date",
            render: (_, d) => new Date(d.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }),
            responsive: ["md"],
        },
        {
            title: "Status",
            render: (_, d) => <Tag color={d.active ? "error" : "default"}>{d.active ? "Disqualified" : "Reinstated"}</Tag>,
        },
        {
            title: "Actions",
            render: (_, d) =>
                d.active ? (
                    <Tooltip title={!canManage ? "Only Admin/Super Admin can reinstate." : ""}>
                        <Popconfirm
                            title="Reinstate this target?"
                            description="This restores their eligibility on the leaderboard."
                            onConfirm={() => reinstateMutation.mutate(d.id)}
                            disabled={!canManage}
                        >
                            <Button size="small" disabled={!canManage}>
                                Reinstate
                            </Button>
                        </Popconfirm>
                    </Tooltip>
                ) : null,
        },
    ]

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-xl font-semibold m-0">Disqualifications & Score Adjustments</h1>
                <Tooltip title={!canManage ? "Only Admin/Super Admin can disqualify a target." : ""}>
                    <Button type="primary" danger icon={<PlusOutlined />} disabled={!canManage} onClick={() => setDisqualifyOpen(true)}>
                        Disqualify
                    </Button>
                </Tooltip>
            </div>

            {!canManage && (
                <Alert
                    type="info"
                    showIcon
                    message="Read-only for your role"
                    description="Auditors can view disqualifications and the score adjustment log but cannot disqualify, reinstate, or make adjustments. Switch to Admin or Super Admin."
                />
            )}

            <Row gutter={[16, 16]}>
                <Col xs={24}>
                    <Card title="Disqualifications">
                        {!sortedDisqualifications.length ? (
                            <Empty description="No disqualifications recorded." />
                        ) : screens.md ? (
                            <Table rowKey="id" columns={columns} dataSource={sortedDisqualifications} pagination={{ pageSize: 10 }} scroll={{ x: true }} />
                        ) : (
                            <List
                                dataSource={sortedDisqualifications}
                                renderItem={(d) => (
                                    <List.Item>
                                        <Card className="w-full" size="small">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <div className="font-medium">{resolveTargetName(d.targetable_type, d.targetable_id)}</div>
                                                    <div className="text-xs text-gray-500">{d.reason}</div>
                                                </div>
                                                <Tag color={d.active ? "error" : "default"}>{d.active ? "Disqualified" : "Reinstated"}</Tag>
                                            </div>
                                            {d.active && canManage && (
                                                <Popconfirm title="Reinstate this target?" onConfirm={() => reinstateMutation.mutate(d.id)}>
                                                    <Button size="small" className="mt-2">
                                                        Reinstate
                                                    </Button>
                                                </Popconfirm>
                                            )}
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        )}
                    </Card>
                </Col>

                <Col xs={24}>
                    <Card
                        title="Score adjustment log (immutable)"
                        extra={
                            <Tooltip title={!canManage ? "Only Admin/Super Admin can add score adjustments." : ""}>
                                <Button icon={<PlusOutlined />} disabled={!canManage} onClick={() => setAdjustOpen(true)}>
                                    Add adjustment
                                </Button>
                            </Tooltip>
                        }
                    >
                        <p className="text-xs text-gray-400 mb-3">
                            This log is append-only — entries are never edited or deleted, only added to.
                        </p>
                        {!sortedAdjustments.length ? (
                            <Empty description="No score adjustments recorded." />
                        ) : (
                            <Timeline
                                items={sortedAdjustments.map((a: ScoreAdjustment) => ({
                                    color: a.points >= 0 ? "green" : "red",
                                    children: (
                                        <div>
                                            <div className="font-medium">
                                                {resolveTargetName(a.targetable_type, a.targetable_id)} — {a.points >= 0 ? "+" : ""}
                                                {a.points} pts ({phases.find((p) => p.id === a.phase_id)?.name})
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(a.created_at).toLocaleString("en-NG")}
                                            </div>
                                            <p className="mt-1 mb-0 text-sm">{a.reason}</p>
                                        </div>
                                    ),
                                }))}
                            />
                        )}
                    </Card>
                </Col>
            </Row>

            <DisqualifyModal open={disqualifyOpen} onClose={() => setDisqualifyOpen(false)} />
            <ScoreAdjustmentModal open={adjustOpen} onClose={() => setAdjustOpen(false)} />
        </div>
    )
}
