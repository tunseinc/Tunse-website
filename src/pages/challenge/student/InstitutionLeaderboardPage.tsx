import { Empty, Grid, List, Progress, Spin, Table, Tabs } from "antd"
import type { ColumnsType } from "antd/es/table"
import { useState } from "react"
import { ProvisionalBadge } from "../../../components/challenge/shared/ProvisionalBadge"
import useDocumentHead from "../../../hooks/use-document-head"
import { usePhases } from "../../../features/challenge/phases/usePhases"
import { useInstitutionLeaderboard } from "../../../features/challenge/leaderboards/useLeaderboards"
import { useAuthStore } from "../../../stores/authStore"

const { useBreakpoint } = Grid

export default function InstitutionLeaderboardPage() {
    useDocumentHead({ title: "Institution Leaderboard — Tunse Challenge" })
    const screens = useBreakpoint()
    const myInstitutionId = useAuthStore((s) => s.user?.student_profile?.institution_id)
    const { data: phases = [] } = usePhases()
    const competitivePhases = phases.filter((p) => p.number > 0)
    const [activeTab, setActiveTab] = useState<string>("")
    const activePhase = competitivePhases.find((p) => String(p.id) === activeTab) ?? competitivePhases[0]

    const { data: board, isLoading } = useInstitutionLeaderboard(activePhase?.id)
    const rows = board?.data ?? []

    const columns: ColumnsType<(typeof rows)[number]> = [
        {
            title: "Rank",
            dataIndex: "rank",
            width: 70,
            render: (rank: number) => <span className="font-semibold">#{rank}</span>,
        },
        {
            title: "Institution",
            render: (_, row) => (
                <div>
                    <div className="font-medium flex items-center gap-2">
                        {row.institution_name}
                        {row.institution_id === myInstitutionId && (
                            <span className="text-xs text-[#668A44] font-semibold">(Your institution)</span>
                        )}
                    </div>
                    <div className="text-xs text-gray-500">{row.state}</div>
                </div>
            ),
        },
        {
            title: "Score",
            dataIndex: "provisional_score",
            sorter: (a, b) => a.provisional_score - b.provisional_score,
            render: (v: number) => <span className="font-semibold">{v} pts</span>,
        },
        {
            title: "Verified participation",
            render: (_, row) => (
                <Progress
                    percent={
                        row.total_participant_count
                            ? Math.round((row.verified_participant_count / row.total_participant_count) * 100)
                            : 0
                    }
                    size="small"
                    format={() => `${row.verified_participant_count}/${row.total_participant_count}`}
                />
            ),
        },
    ]

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold m-0">Institution Leaderboard</h1>
                    <p className="text-gray-500 text-sm m-0">
                        Ranking of every participating institution by provisional score.
                    </p>
                </div>
                <ProvisionalBadge phaseStatus={activePhase?.status ?? "open"} />
            </div>

            <Tabs
                activeKey={String(activePhase?.id ?? "")}
                onChange={setActiveTab}
                items={competitivePhases.map((p) => ({ key: String(p.id), label: p.name }))}
            />

            {isLoading ? (
                <Spin />
            ) : !rows.length ? (
                <Empty description="No institution data for this phase yet" />
            ) : screens.md ? (
                <Table
                    rowKey="institution_id"
                    columns={columns}
                    dataSource={rows}
                    pagination={{ pageSize: 10 }}
                    rowClassName={(row) => (row.institution_id === myInstitutionId ? "!bg-[#EEFFE2]" : "")}
                />
            ) : (
                <List
                    dataSource={rows}
                    renderItem={(row) => (
                        <List.Item>
                            <div
                                className={`w-full rounded-lg border border-gray-100 p-3 ${row.institution_id === myInstitutionId ? "!bg-[#EEFFE2]" : "bg-white"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <div className="font-semibold">#{row.rank} &middot; {row.institution_name}</div>
                                        <div className="text-xs text-gray-500">{row.state}</div>
                                    </div>
                                    <div className="font-semibold">{row.provisional_score} pts</div>
                                </div>
                                <Progress
                                    className="mt-2"
                                    percent={
                                        row.total_participant_count
                                            ? Math.round((row.verified_participant_count / row.total_participant_count) * 100)
                                            : 0
                                    }
                                    size="small"
                                    format={() => `${row.verified_participant_count}/${row.total_participant_count} verified`}
                                />
                            </div>
                        </List.Item>
                    )}
                />
            )}
        </div>
    )
}
