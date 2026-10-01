import {
    AuditOutlined,
    BankOutlined,
    DownloadOutlined,
    RightOutlined,
    SolutionOutlined,
} from "@ant-design/icons"
import { Alert, Card, Col, Popconfirm, Progress, Row, Spin, Statistic, Steps, Table, Tabs, Tag, Tooltip, Button } from "antd"
import type { ColumnsType } from "antd/es/table"
import { Link, useNavigate } from "react-router"
import { RiskFlagTag } from "../../../components/challenge/admin/RiskFlagTag"
import type { RiskReason } from "../../../components/challenge/admin/riskFlags"
import { PhaseBadge } from "../../../components/challenge/shared/PhaseBadge"
import { useDashboard } from "../../../features/challenge/dashboard/useDashboard"
import { useAdminClaims } from "../../../features/challenge/claims/useClaims"
import { usePhases, useTransitionPhase } from "../../../features/challenge/phases/usePhases"
import { useAuthStore } from "../../../stores/authStore"
import type { PhaseStatus } from "../../../lib/api/phases"
import type { Claim } from "../../../lib/api/claims"
import useDocumentHead from "../../../hooks/use-document-head"

const STATUS_ORDER: PhaseStatus[] = ["draft", "open", "frozen", "closed"]

export default function AdminDashboardPage() {
    useDocumentHead({ title: "Dashboard — Tunse Challenge Admin" })
    const navigate = useNavigate()
    const role = useAuthStore((s) => s.user?.role)
    const canManagePhases = role !== "auditor"

    const { data: kpis, isLoading: kpisLoading } = useDashboard()
    const { data: phases = [] } = usePhases()
    const { data: riskData } = useAdminClaims({ sort: "risk" })
    const transitionMutation = useTransitionPhase()

    const risks = (riskData?.data ?? []).filter((c) => (c.risk_reasons ?? []).length > 0).slice(0, 5)

    const riskColumns: ColumnsType<Claim> = [
        {
            title: "Claim",
            render: (_, c) => (
                <div>
                    <div className="font-medium">{c.recruit_name}</div>
                    <div className="text-xs text-gray-500">{c.student_name ?? "Unknown student"}</div>
                </div>
            ),
        },
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

    const overview = kpisLoading || !kpis ? (
        <Spin />
    ) : (
        <div className="flex flex-col gap-5">
            <Row gutter={[16, 16]}>
                <Col xs={12} md={6}>
                    <Card>
                        <Statistic title="Total participants" value={kpis.participants} />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card>
                        <Statistic
                            title="Active institutions"
                            value={kpis.institutions.active}
                            suffix={`/ ${kpis.institutions.active + kpis.institutions.inactive}`}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total claims"
                            value={Object.values(kpis.claims_by_status).reduce((a, b) => a + b, 0)}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card>
                        <Statistic
                            title="Rejection rate"
                            value={kpis.rejection_rate}
                            suffix="%"
                            valueStyle={kpis.rejection_rate > 20 ? { color: "#CF4F4F" } : undefined}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Provisional vs. verified split">
                        <div className="flex flex-col gap-2">
                            <Tooltip title="Pending / unaudited claims">
                                <Progress
                                    percent={
                                        kpis.pending_audit_count
                                            ? Math.round(
                                                  (kpis.pending_audit_count /
                                                      Object.values(kpis.claims_by_status).reduce((a, b) => a + b, 0)) *
                                                      100,
                                              )
                                            : 0
                                    }
                                    status="active"
                                    format={() => `${kpis.pending_audit_count} pending`}
                                />
                            </Tooltip>
                            <Progress percent={kpis.verification_rate} status="success" format={() => `${kpis.verification_rate}% verified`} />
                            <Progress percent={kpis.rejection_rate} status="exception" format={() => `${kpis.rejection_rate}% rejected`} />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Claims by type">
                        <Table
                            size="small"
                            pagination={false}
                            rowKey={(r) => r.claim_type ?? "unknown"}
                            dataSource={kpis.claims_by_type}
                            columns={[
                                { title: "Type", dataIndex: "claim_type" },
                                { title: "Count", dataIndex: "total", width: 80 },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Coverage">
                <Table
                    size="small"
                    pagination={false}
                    rowKey="key"
                    dataSource={[
                        { key: "states", label: "States covered", value: Object.keys(kpis.state_coverage).length },
                        { key: "lgas", label: "LGAs covered", value: Object.keys(kpis.lga_coverage).length },
                        { key: "categories", label: "Priority categories covered", value: Object.keys(kpis.category_coverage).length },
                    ]}
                    columns={[
                        { title: "Metric", dataIndex: "label" },
                        { title: "Count", dataIndex: "value", width: 100 },
                    ]}
                />
            </Card>

            <Row gutter={[16, 16]}>
                <Col xs={12} md={6}>
                    <Link to="/challenge/admin/claims">
                        <Card hoverable>
                            <div className="flex items-center justify-between">
                                <div>
                                    <SolutionOutlined className="text-xl text-[#668A44]" />
                                    <div className="font-medium mt-2">Claims Queue</div>
                                </div>
                                <RightOutlined className="text-gray-400" />
                            </div>
                        </Card>
                    </Link>
                </Col>
                <Col xs={12} md={6}>
                    <Link to="/challenge/admin/audit-queue">
                        <Card hoverable>
                            <div className="flex items-center justify-between">
                                <div>
                                    <AuditOutlined className="text-xl text-[#668A44]" />
                                    <div className="font-medium mt-2">Audit Queue</div>
                                </div>
                                <RightOutlined className="text-gray-400" />
                            </div>
                        </Card>
                    </Link>
                </Col>
                <Col xs={12} md={6}>
                    <Link to="/challenge/admin/institutions">
                        <Card hoverable>
                            <div className="flex items-center justify-between">
                                <div>
                                    <BankOutlined className="text-xl text-[#668A44]" />
                                    <div className="font-medium mt-2">Institutions</div>
                                </div>
                                <RightOutlined className="text-gray-400" />
                            </div>
                        </Card>
                    </Link>
                </Col>
                <Col xs={12} md={6}>
                    <Link to="/challenge/admin/exports">
                        <Card hoverable>
                            <div className="flex items-center justify-between">
                                <div>
                                    <DownloadOutlined className="text-xl text-[#668A44]" />
                                    <div className="font-medium mt-2">Exports</div>
                                </div>
                                <RightOutlined className="text-gray-400" />
                            </div>
                        </Card>
                    </Link>
                </Col>
            </Row>
        </div>
    )

    const phaseControls = (
        <div className="flex flex-col gap-4">
            {!canManagePhases && (
                <Alert
                    type="info"
                    showIcon
                    message="Read-only for your role"
                    description="Auditors can view phase status but cannot advance it. Switch to Admin or Super Admin to manage phases."
                />
            )}
            {phases.map((phase) => {
                const currentIndex = STATUS_ORDER.indexOf(phase.status)
                const nextStatus = STATUS_ORDER[currentIndex + 1]
                return (
                    <Card
                        key={phase.id}
                        title={
                            <div className="flex items-center gap-2">
                                <span>{phase.name}</span>
                                <PhaseBadge status={phase.status} />
                            </div>
                        }
                        extra={
                            nextStatus ? (
                                <Tooltip title={!canManagePhases ? "Auditors cannot advance phase status." : `Advance to "${nextStatus}"`}>
                                    <Popconfirm
                                        title={`Advance "${phase.name}" to ${nextStatus}?`}
                                        onConfirm={() => transitionMutation.mutate({ id: phase.id, status: nextStatus })}
                                        disabled={!canManagePhases}
                                    >
                                        <Button size="small" type="primary" disabled={!canManagePhases}>
                                            Advance to {nextStatus}
                                        </Button>
                                    </Popconfirm>
                                </Tooltip>
                            ) : (
                                <Tag>Final state</Tag>
                            )
                        }
                    >
                        <Steps
                            size="small"
                            current={currentIndex}
                            items={STATUS_ORDER.map((s) => ({ title: s }))}
                        />
                    </Card>
                )
            })}
        </div>
    )

    const riskQueuePreview = (
        <Card
            title="Risk-based audit priority (top 5)"
            extra={<Link to="/challenge/admin/audit-queue">View full queue</Link>}
        >
            {risks.length ? (
                <Table
                    size="small"
                    pagination={false}
                    rowKey="id"
                    dataSource={risks}
                    columns={riskColumns}
                    onRow={(c) => ({
                        onClick: () => navigate(`/challenge/admin/claims/${c.id}`),
                        className: "cursor-pointer",
                    })}
                />
            ) : (
                <Alert type="success" showIcon message="No high-risk claims right now." />
            )}
        </Card>
    )

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
            <h1 className="text-xl font-semibold m-0">Admin Dashboard</h1>
            <Tabs
                items={[
                    { key: "overview", label: "Overview", children: overview },
                    { key: "phases", label: "Phase Controls", children: phaseControls },
                    { key: "risk", label: "Risk Queue Preview", children: riskQueuePreview },
                ]}
            />
        </div>
    )
}
