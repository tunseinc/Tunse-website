import { Alert, Card, Col, Descriptions, Empty, Grid, List, Row, Spin, Statistic, Table } from "antd"
import type { ColumnsType } from "antd/es/table"
import useDocumentHead from "../../../hooks/use-document-head"
import { useActivePhase } from "../../../features/challenge/phases/usePhases"
import { useInstitutions } from "../../../features/challenge/institutions/useInstitutions"
import { useIndividualLeaderboard, useInstitutionLeaderboard } from "../../../features/challenge/leaderboards/useLeaderboards"
import { useAuthStore } from "../../../stores/authStore"
import type { IndividualLeaderboardRow } from "../../../lib/api/leaderboards"

const { useBreakpoint } = Grid

export default function InstitutionOverviewPage() {
    useDocumentHead({ title: "Institution Overview — Tunse Challenge" })
    const screens = useBreakpoint()
    const user = useAuthStore((s) => s.user)
    const institutionId = user?.student_profile?.institution_id
    const { data: institutions = [] } = useInstitutions()
    const institution = institutions.find((i) => i.id === institutionId)
    const { data: phase } = useActivePhase()

    const { data: institutionBoard } = useInstitutionLeaderboard(phase?.id)
    const { data: individualBoard, isLoading } = useIndividualLeaderboard(phase?.id, institutionId)
    const myInstitutionRow = institutionBoard?.data.find((r) => r.institution_id === institutionId)
    const rows = individualBoard?.data ?? []

    if (!institutionId || !institution) {
        return (
            <Empty description="Log in with a student account to see your institution's standing" />
        )
    }

    const columns: ColumnsType<IndividualLeaderboardRow> = [
        { title: "Name", dataIndex: "full_name" },
        { title: "Challenge ID", dataIndex: "challenge_id" },
        { title: "Provisional score", dataIndex: "provisional_score" },
        { title: "Verified claims", dataIndex: "verified_claim_count" },
    ]

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
            <div>
                <h1 className="text-xl font-semibold m-0">Institution Overview</h1>
                <p className="text-gray-500 text-sm m-0">Read-only view of your institution's Challenge standing.</p>
            </div>

            <Alert
                type="info"
                showIcon
                message="View only — claim validation requires separately assigned access"
                description="This portal does not carry permission to validate, verify, or reject claims. Auditing is handled exclusively by the Tunse audit team."
            />

            <Card title="Institution details">
                <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }} size="small">
                    <Descriptions.Item label="Institution">{institution.name}</Descriptions.Item>
                    <Descriptions.Item label="State">{institution.state}</Descriptions.Item>
                    <Descriptions.Item label="Coordinator">
                        {institution.coordinator_name ?? <span className="text-gray-400">Not yet assigned</span>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Short code">{institution.short_code}</Descriptions.Item>
                </Descriptions>
            </Card>

            {phase && (
                <Row gutter={[16, 16]}>
                    <Col xs={12} md={6}>
                        <Card>
                            <Statistic title={`${phase.name} score`} value={myInstitutionRow?.provisional_score ?? 0} suffix="pts" />
                        </Card>
                    </Col>
                    <Col xs={12} md={6}>
                        <Card>
                            <Statistic title="National rank" value={`#${myInstitutionRow?.rank ?? "-"}`} />
                        </Card>
                    </Col>
                    <Col xs={12} md={6}>
                        <Card>
                            <Statistic
                                title="Verified participants"
                                value={myInstitutionRow?.verified_participant_count ?? 0}
                                suffix={`/ ${myInstitutionRow?.total_participant_count ?? rows.length}`}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} md={6}>
                        <Card>
                            <Statistic title="Registered students" value={rows.length} />
                        </Card>
                    </Col>
                </Row>
            )}

            <Card title="Students">
                {isLoading ? (
                    <Spin />
                ) : !rows.length ? (
                    <Empty description="No claims submitted by this institution yet" />
                ) : screens.md ? (
                    <Table rowKey="user_id" columns={columns} dataSource={rows} pagination={{ pageSize: 10 }} />
                ) : (
                    <List
                        dataSource={rows}
                        renderItem={(row) => (
                            <List.Item>
                                <Card size="small" className="w-full">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <div className="font-medium">{row.full_name}</div>
                                            <div className="text-xs text-gray-500">{row.challenge_id}</div>
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
            </Card>
        </div>
    )
}
