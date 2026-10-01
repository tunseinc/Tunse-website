import { DownloadOutlined } from "@ant-design/icons"
import { Button, Card, Col, Row, Select, Space, message } from "antd"
import { useState } from "react"
import { downloadExport } from "../../../lib/api/exports"
import { usePhases } from "../../../features/challenge/phases/usePhases"
import useDocumentHead from "../../../hooks/use-document-head"

export default function AdminExportsPage() {
    useDocumentHead({ title: "Exports — Tunse Challenge Admin" })
    const { data: phases = [] } = usePhases()
    const [leaderboardPhaseId, setLeaderboardPhaseId] = useState<number | undefined>()
    const activePhaseId = leaderboardPhaseId ?? phases.find((p) => p.number > 0)?.id ?? phases[0]?.id

    const runExport = async (kind: Parameters<typeof downloadExport>[0], params?: Record<string, unknown>) => {
        try {
            await downloadExport(kind, params)
        } catch {
            message.error("Could not generate the export. Please try again.")
        }
    }

    const phaseSelector = (
        <Select
            value={activePhaseId}
            onChange={setLeaderboardPhaseId}
            style={{ width: 220 }}
            options={phases.map((p) => ({ value: p.id, label: p.name }))}
        />
    )

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <h1 className="text-xl font-semibold m-0">Exports</h1>
            <p className="text-gray-500 text-sm m-0">Bulk CSV exports generated from live Challenge data.</p>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Claims">
                        <p className="text-sm text-gray-500">All claims across every phase, with student, institution, and status.</p>
                        <Button type="primary" icon={<DownloadOutlined />} onClick={() => runExport("claims")}>
                            Download CSV
                        </Button>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Students">
                        <p className="text-sm text-gray-500">All registered students with institution and status.</p>
                        <Button type="primary" icon={<DownloadOutlined />} onClick={() => runExport("students")}>
                            Download CSV
                        </Button>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Institutions">
                        <p className="text-sm text-gray-500">All institutions with state, coordinator, and active status.</p>
                        <Button type="primary" icon={<DownloadOutlined />} onClick={() => runExport("institutions")}>
                            Download CSV
                        </Button>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Audit Log">
                        <p className="text-sm text-gray-500">Every audit decision recorded, including seeded history.</p>
                        <Button type="primary" icon={<DownloadOutlined />} onClick={() => runExport("audit-log")}>
                            Download CSV
                        </Button>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Institution Leaderboard">
                        <p className="text-sm text-gray-500">Ranked institution standings for the selected phase.</p>
                        <Space wrap>
                            {phaseSelector}
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                disabled={!activePhaseId}
                                onClick={() => runExport("leaderboard-institution", { phase_id: activePhaseId })}
                            >
                                Download CSV
                            </Button>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Individual Leaderboard">
                        <p className="text-sm text-gray-500">Ranked student standings for the selected phase.</p>
                        <Space wrap>
                            {phaseSelector}
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                disabled={!activePhaseId}
                                onClick={() => runExport("leaderboard-individual", { phase_id: activePhaseId })}
                            >
                                Download CSV
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
