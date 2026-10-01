import { CameraOutlined, LockOutlined } from "@ant-design/icons"
import { Alert, Button, Card, Drawer, Empty, Popconfirm, Table, Tabs, Tag, Tooltip } from "antd"
import { useState } from "react"
import { ProvisionalBadge } from "../../../components/challenge/shared/ProvisionalBadge"
import { useAuthStore } from "../../../stores/authStore"
import { usePhases, useTransitionPhase } from "../../../features/challenge/phases/usePhases"
import { useCreateSnapshot, useSnapshots } from "../../../features/challenge/snapshots/useSnapshots"
import type { LeaderboardSnapshot } from "../../../lib/api/snapshots"
import type { Phase } from "../../../lib/api/phases"
import type { IndividualLeaderboardRow, InstitutionLeaderboardRow } from "../../../lib/api/leaderboards"
import useDocumentHead from "../../../hooks/use-document-head"

function PhaseLeaderboardControl({ phase }: { phase: Phase }) {
    const role = useAuthStore((s) => s.user?.role)
    const { data: snapshots = [] } = useSnapshots(phase.id)
    const [viewingSnapshot, setViewingSnapshot] = useState<LeaderboardSnapshot | null>(null)
    const createSnapshotMutation = useCreateSnapshot()
    const transitionMutation = useTransitionPhase()

    const canSnapshot = role !== "auditor"
    const canFinalize = role === "super_admin"
    const isFrozen = phase.status === "frozen"
    const phaseSnapshots = [...snapshots].sort((a, b) => b.created_at.localeCompare(a.created_at))

    const handleSnapshot = () =>
        createSnapshotMutation.mutate({
            phase_id: phase.id,
            snapshot_type: "provisional",
            note: `Manual provisional snapshot taken while ${phase.status}.`,
        })

    const handleFinalize = () => {
        transitionMutation.mutate(
            { id: phase.id, status: "closed" },
            {
                onSuccess: () =>
                    createSnapshotMutation.mutate({
                        phase_id: phase.id,
                        snapshot_type: "final",
                        note: "Final results published after 100% audit of claims supporting the winning score.",
                    }),
            },
        )
    }

    const individualBoard = (viewingSnapshot?.payload.individual as IndividualLeaderboardRow[] | undefined)?.slice(0, 10) ?? []
    const institutionBoard = (viewingSnapshot?.payload.institution as InstitutionLeaderboardRow[] | undefined)?.slice(0, 10) ?? []

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <ProvisionalBadge phaseStatus={phase.status} />
                <div className="flex gap-2">
                    <Tooltip title={!canSnapshot ? "Only Admin/Super Admin can take a snapshot." : ""}>
                        <Popconfirm
                            title="Take a provisional snapshot?"
                            description="This records the current standings without freezing the phase."
                            onConfirm={handleSnapshot}
                            disabled={!canSnapshot}
                        >
                            <Button icon={<CameraOutlined />} disabled={!canSnapshot}>
                                Take Snapshot
                            </Button>
                        </Popconfirm>
                    </Tooltip>
                    <Tooltip
                        title={
                            !isFrozen
                                ? "Freeze the phase (in Phase Controls) before it can be finalized."
                                : !canFinalize
                                    ? "Only Super Admin can finalize a phase's leaderboard."
                                    : "Publishes final results and closes the phase."
                        }
                    >
                        <Popconfirm
                            title="Freeze & finalize this phase's leaderboard?"
                            description="This publishes a Final Results snapshot and closes the phase. This cannot be undone."
                            onConfirm={handleFinalize}
                            disabled={!isFrozen || !canFinalize}
                        >
                            <Button type="primary" danger icon={<LockOutlined />} disabled={!isFrozen || !canFinalize}>
                                Freeze & Finalize
                            </Button>
                        </Popconfirm>
                    </Tooltip>
                </div>
            </div>

            {phase.status !== "closed" && (
                <Alert
                    type="warning"
                    showIcon
                    message="Provisional until finalized"
                    description="Before prize payment, the dev spec requires 100% audit of all claims necessary to support the winning score, and the leaderboard must be frozen during the final validation window."
                />
            )}

            <Card title="Snapshot history" size="small">
                {!phaseSnapshots.length ? (
                    <Empty description="No snapshots taken yet." />
                ) : (
                    <Table
                        rowKey="id"
                        size="small"
                        pagination={false}
                        dataSource={phaseSnapshots}
                        columns={[
                            {
                                title: "Type",
                                render: (_, s: LeaderboardSnapshot) => (
                                    <Tag color={s.snapshot_type === "final" ? "success" : "gold"}>
                                        {s.snapshot_type === "final" ? "Final" : "Provisional"}
                                    </Tag>
                                ),
                            },
                            { title: "Note", dataIndex: "note" },
                            {
                                title: "Date",
                                render: (_, s: LeaderboardSnapshot) => new Date(s.created_at).toLocaleString("en-NG"),
                            },
                            {
                                title: "",
                                render: (_, s: LeaderboardSnapshot) => (
                                    <Button size="small" onClick={() => setViewingSnapshot(s)}>
                                        View
                                    </Button>
                                ),
                            },
                        ]}
                    />
                )}
            </Card>

            <Drawer
                title={viewingSnapshot ? `Leaderboard — ${new Date(viewingSnapshot.created_at).toLocaleString("en-NG")}` : ""}
                open={!!viewingSnapshot}
                onClose={() => setViewingSnapshot(null)}
                width={560}
            >
                <h4>Individual (top 10)</h4>
                <Table
                    rowKey="user_id"
                    size="small"
                    pagination={false}
                    dataSource={individualBoard}
                    className="mb-4"
                    columns={[
                        { title: "#", dataIndex: "rank", width: 48 },
                        { title: "Student", dataIndex: "full_name" },
                        { title: "Institution", dataIndex: "institution_name" },
                        { title: "Score", dataIndex: "provisional_score" },
                    ]}
                />
                <h4>Institution (top 10)</h4>
                <Table
                    rowKey="institution_id"
                    size="small"
                    pagination={false}
                    dataSource={institutionBoard}
                    columns={[
                        { title: "#", dataIndex: "rank", width: 48 },
                        { title: "Institution", dataIndex: "institution_name" },
                        { title: "Score", dataIndex: "provisional_score" },
                    ]}
                />
            </Drawer>
        </div>
    )
}

export default function AdminLeaderboardControlPage() {
    useDocumentHead({ title: "Leaderboard Control — Tunse Challenge Admin" })
    const { data: phases = [] } = usePhases()
    const competitivePhases = phases.filter((p) => p.number > 0)

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
            <h1 className="text-xl font-semibold m-0">Leaderboard Control</h1>
            <p className="text-gray-500 text-sm m-0">
                Tie-breakers (when scores are equal): higher verified/audited points, then more unique qualifying
                recruits, then whichever student reached that final score earliest.
            </p>
            <Tabs
                items={competitivePhases.map((phase) => ({
                    key: String(phase.id),
                    label: phase.name,
                    children: <PhaseLeaderboardControl phase={phase} />,
                }))}
            />
        </div>
    )
}
