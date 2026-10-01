import { FileAddOutlined } from "@ant-design/icons"
import { Alert, Avatar, Button, Card, Col, Empty, Progress, Row, Statistic, Table, Tooltip } from "antd"
import type { ColumnsType } from "antd/es/table"
import { Link } from "react-router"
import { ClaimStatusTag } from "../../../components/challenge/shared/ClaimStatusTag"
import { ProvisionalBadge } from "../../../components/challenge/shared/ProvisionalBadge"
import useDocumentHead from "../../../hooks/use-document-head"
import { useActivePhase } from "../../../features/challenge/phases/usePhases"
import { useMyClaims } from "../../../features/challenge/claims/useClaims"
import { useIndividualLeaderboard, useInstitutionLeaderboard } from "../../../features/challenge/leaderboards/useLeaderboards"
import { useMyBadges } from "../../../features/challenge/badges/useBadges"
import { useAuthStore } from "../../../stores/authStore"
import type { Claim } from "../../../lib/api/claims"

export default function StudentDashboardPage() {
    useDocumentHead({ title: "My Dashboard — Tunse Challenge" })
    const user = useAuthStore((s) => s.user)
    const { data: phase } = useActivePhase()
    const { data: myClaims = [] } = useMyClaims(phase ? { phase_id: phase.id } : {})
    const { data: individualBoard } = useIndividualLeaderboard(phase?.id)
    const { data: institutionBoard } = useInstitutionLeaderboard(phase?.id)
    const { data: badges = [] } = useMyBadges()

    const myRow = individualBoard?.data.find((r) => r.user_id === user?.id)
    const myInstitutionRow = institutionBoard?.data.find(
        (r) => r.institution_id === user?.student_profile?.institution_id,
    )

    const counts = {
        submitted: myClaims.filter((c) => c.status === "submitted").length,
        verified: myClaims.filter((c) => c.status === "verified").length,
        rejected: myClaims.filter((c) => c.status === "rejected").length,
        flagged: myClaims.filter((c) => c.status === "flagged").length,
    }

    const columns: ColumnsType<Claim> = [
        { title: "Recruit", dataIndex: "recruit_name" },
        { title: "Type", render: (_, c) => c.claim_type?.label },
        { title: "Points", dataIndex: "provisional_points" },
        { title: "Status", render: (_, c) => <ClaimStatusTag status={c.status} /> },
    ]

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold m-0">Welcome back, {user?.name.split(" ")[0]}</h1>
                    <p className="text-gray-500 text-sm m-0">
                        Challenge ID: {user?.student_profile?.challenge_id}
                    </p>
                </div>
                {phase && <ProvisionalBadge phaseStatus={phase.status} />}
            </div>

            {phase && (
                <Alert
                    type="info"
                    className="bg-[#f1f7f3] border-[#81aa5c]"
                    showIcon
                    styles={{
                        icon: { color: "#668A44" },
                        actions: { color: "#668A44" },
                    }}
                    message={`${phase.name} is open`}
                    description={`Closes ${new Date(phase.ends_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}. ${phase.prize_text ?? ""}`}
                />
            )}

            <Row gutter={[16, 16]}>
                <Col xs={12} md={6}>
                    <Card>
                        <Statistic title="My phase score" value={myRow?.provisional_score ?? 0} suffix="pts" />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card>
                        <Statistic title="Individual rank" value={`#${myRow?.rank ?? "-"}`} />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card>
                        <Statistic
                            title="My institution's national rank"
                            value={`#${myInstitutionRow?.rank ?? "-"}`}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card>
                        <Statistic title="Verified claims" value={counts.verified} suffix={`/ ${myClaims.length}`} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                    <Card
                        title="Recent claims"
                        extra={<Link to="/challenge/student/claims">View all</Link>}
                    >
                        {myClaims.length ? (
                            <Table
                                rowKey="id"
                                columns={columns}
                                dataSource={[...myClaims]
                                    .sort((a, b) => b.created_at.localeCompare(a.created_at))
                                    .slice(0, 5)}
                                pagination={false}
                                size="small"
                            />
                        ) : (
                            <Empty description="No claims submitted yet this phase">
                                <Link to="/challenge/student/claims/new">
                                    <Button type="primary" shape="round">
                                        Submit your first claim
                                    </Button>
                                </Link>
                            </Empty>
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <div className="flex flex-col gap-4">
                        <Card className="!bg-[#EEFFE2] text-center">
                            <FileAddOutlined className="text-2xl text-[#668A44] mb-2" />
                            <p className="text-sm text-gray-600 mb-3">
                                Recruited a verifier, T-worker, customer or vendor?
                            </p>
                            <Link to="/challenge/student/claims/new">
                                <Button type="primary" shape="round" block>
                                    Submit a new claim
                                </Button>
                            </Link>
                        </Card>
                        <Card title="Claim status breakdown">
                            <div className="flex flex-col gap-2">
                                <Tooltip title="Pending / Unaudited">
                                    <Progress percent={myClaims.length ? Math.round((counts.submitted / myClaims.length) * 100) : 0} status="active" format={() => `${counts.submitted} pending`} />
                                </Tooltip>
                                <Progress percent={myClaims.length ? Math.round((counts.verified / myClaims.length) * 100) : 0} status="success" format={() => `${counts.verified} verified`} />
                                <Progress percent={myClaims.length ? Math.round((counts.rejected / myClaims.length) * 100) : 0} status="exception" format={() => `${counts.rejected} rejected`} />
                            </div>
                        </Card>
                        <Card title="Badges earned">
                            {badges.length ? (
                                <Avatar.Group>
                                    {badges.map((b) => (
                                        <Tooltip key={b.id} title={`${b.badge.name} — ${b.badge.criteria_text ?? ""}`}>
                                            <Avatar style={{ backgroundColor: "#F9AA33" }}>{b.badge.name.charAt(0)}</Avatar>
                                        </Tooltip>
                                    ))}
                                </Avatar.Group>
                            ) : (
                                <span className="text-gray-400 text-sm">No badges yet — keep recruiting!</span>
                            )}
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
