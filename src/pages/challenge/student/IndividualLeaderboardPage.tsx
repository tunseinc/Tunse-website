import { InfoCircleOutlined, TrophyFilled } from "@ant-design/icons"
import { Avatar, Card, Col, Empty, Grid, List, Row, Segmented, Spin, Table, Tabs, Tag, Tooltip } from "antd"
import type { ColumnsType } from "antd/es/table"
import { useState } from "react"
import { ProvisionalBadge } from "../../../components/challenge/shared/ProvisionalBadge"
import useDocumentHead from "../../../hooks/use-document-head"
import { usePhases } from "../../../features/challenge/phases/usePhases"
import { useCumulativeLeaderboard, useIndividualLeaderboard } from "../../../features/challenge/leaderboards/useLeaderboards"
import { useAuthStore } from "../../../stores/authStore"
import type { IndividualLeaderboardRow } from "../../../lib/api/leaderboards"

const { useBreakpoint } = Grid

const PODIUM_COLORS = ["#F9AA33", "#B0B0B0", "#C87F3C"]

type Scope = "institution" | "national"

export default function IndividualLeaderboardPage() {
    useDocumentHead({ title: "Individual Leaderboard — Tunse Challenge" })
    const screens = useBreakpoint()
    const user = useAuthStore((s) => s.user)
    const [scope, setScope] = useState<Scope>("institution")
    const { data: phases = [] } = usePhases()
    const competitivePhases = phases.filter((p) => p.number > 0)
    const [activeTab, setActiveTab] = useState<string>("cumulative")
    const activePhase = competitivePhases.find((p) => String(p.id) === activeTab)

    const institutionId = scope === "institution" ? user?.student_profile?.institution_id : undefined
    const { data: phaseBoard, isLoading: isPhaseLoading } = useIndividualLeaderboard(activePhase?.id, institutionId)
    const { data: cumulativeBoard = [], isLoading: isCumulativeLoading } = useCumulativeLeaderboard()

    const isCumulative = activeTab === "cumulative"
    const isLoading = isCumulative ? isCumulativeLoading : isPhaseLoading

    const scopedCumulative = institutionId
        ? cumulativeBoard.filter((r) => r.institution_id === institutionId)
        : cumulativeBoard

    const rows: IndividualLeaderboardRow[] = isCumulative
        ? scopedCumulative.map((row, index) => ({
              user_id: row.user_id,
              full_name: row.full_name,
              challenge_id: row.challenge_id,
              institution_id: row.institution_id,
              institution_name: row.institution_name,
              provisional_score: row.cumulative_provisional_score,
              audited_score: row.cumulative_audited_score,
              verified_claim_count: 0,
              disqualified: false,
              rank: index + 1,
          }))
        : (phaseBoard?.data ?? [])

    const phaseStatus = isCumulative ? "open" : activePhase?.status ?? "open"
    const podium = rows.slice(0, 3)
    const avatarColor = (userId: number) => (userId === user?.id ? "#668A44" : "#98BC77")

    const columns: ColumnsType<IndividualLeaderboardRow> = [
        {
            title: "Rank",
            dataIndex: "rank",
            width: 70,
            render: (rank: number) => <span className="font-semibold">#{rank}</span>,
        },
        {
            title: "Participant",
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <Avatar style={{ backgroundColor: avatarColor(row.user_id) }}>{row.full_name.charAt(0)}</Avatar>
                    <div>
                        <div className="font-medium flex items-center gap-2">
                            {row.full_name}
                            {row.user_id === user?.id && <Tag color="blue">You</Tag>}
                            {row.disqualified && <Tag color="error">Disqualified</Tag>}
                        </div>
                        <div className="text-xs text-gray-500">{row.challenge_id}</div>
                    </div>
                </div>
            ),
        },
        { title: "Institution", dataIndex: "institution_name" },
        {
            title: "Score",
            dataIndex: "provisional_score",
            sorter: (a, b) => a.provisional_score - b.provisional_score,
            render: (v: number) => <span className="font-semibold">{v} pts</span>,
        },
        { title: "Verified claims", dataIndex: "verified_claim_count" },
    ]

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold m-0">Individual Leaderboard</h1>
                    <p className="text-gray-500 text-sm m-0">
                        See how you rank against other participants, phase by phase.
                    </p>
                </div>
                <ProvisionalBadge phaseStatus={phaseStatus} />
            </div>

            <Segmented
                value={scope}
                onChange={(v) => setScope(v as Scope)}
                options={[
                    { label: "My Institution", value: "institution" },
                    { label: "National", value: "national" },
                ]}
            />

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    ...competitivePhases.map((p) => ({ key: String(p.id), label: p.name })),
                    { key: "cumulative", label: "Cumulative" },
                ]}
            />

            {isLoading ? (
                <Spin />
            ) : !rows.length ? (
                <Empty description="No leaderboard data for this scope yet" />
            ) : (
                <>
                    {podium.length > 0 && (
                        <Row gutter={[12, 12]}>
                            {podium.map((row, i) => (
                                <Col xs={24} sm={8} key={row.user_id}>
                                    <Card
                                        className={row.user_id === user?.id ? "!border-[#668A44]" : ""}
                                        styles={{ body: { textAlign: "center", padding: 16 } }}
                                    >
                                        <TrophyFilled style={{ color: PODIUM_COLORS[i], fontSize: 22 }} />
                                        <div className="mt-1">
                                            <Avatar size={48} style={{ backgroundColor: avatarColor(row.user_id) }}>
                                                {row.full_name.charAt(0)}
                                            </Avatar>
                                        </div>
                                        <div className="font-medium mt-2 flex items-center justify-center gap-2">
                                            {row.full_name}
                                            {row.user_id === user?.id && <Tag color="blue">You</Tag>}
                                        </div>
                                        <div className="text-xs text-gray-500">{row.institution_name}</div>
                                        <div className="text-lg font-semibold mt-1">
                                            #{row.rank} &middot; {row.provisional_score} pts
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}

                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">Full standings</span>
                        <Tooltip title="Ties are broken by: 1) higher verified/audited points, 2) more unique qualifying recruits, 3) whichever participant reached their final score earliest.">
                            <InfoCircleOutlined className="text-gray-400" />
                        </Tooltip>
                    </div>

                    {screens.md ? (
                        <Table
                            rowKey="user_id"
                            columns={columns}
                            dataSource={rows}
                            pagination={{ pageSize: 10 }}
                            rowClassName={(row) => (row.user_id === user?.id ? "!bg-[#EEFFE2]" : "")}
                        />
                    ) : (
                        <List
                            dataSource={rows}
                            renderItem={(row) => (
                                <List.Item>
                                    <Card
                                        size="small"
                                        className={`w-full ${row.user_id === user?.id ? "!bg-[#EEFFE2]" : ""}`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold w-8">#{row.rank}</span>
                                                <Avatar style={{ backgroundColor: avatarColor(row.user_id) }}>
                                                    {row.full_name.charAt(0)}
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium flex items-center gap-1">
                                                        {row.full_name}
                                                        {row.user_id === user?.id && <Tag color="blue">You</Tag>}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{row.institution_name}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">{row.provisional_score} pts</div>
                                                <div className="text-xs text-gray-500">{row.verified_claim_count} verified</div>
                                            </div>
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    )}
                </>
            )}
        </div>
    )
}
