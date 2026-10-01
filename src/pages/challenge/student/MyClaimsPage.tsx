import { Card, Empty, Grid, Input, List, Select, Space, Spin, Table, Tabs, Tag, Tooltip } from "antd"
import type { ColumnsType } from "antd/es/table"
import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { CategoryIcon } from "../../../components/challenge/shared/CategoryIcon"
import { ClaimStatusTag } from "../../../components/challenge/shared/ClaimStatusTag"
import type { ClaimStatus } from "../../../data/challenge"
import useDocumentHead from "../../../hooks/use-document-head"
import { useMyClaims } from "../../../features/challenge/claims/useClaims"
import { useCommunitySubmissions } from "../../../features/challenge/community/useCommunitySubmissions"
import { usePhases } from "../../../features/challenge/phases/usePhases"
import type { Claim } from "../../../lib/api/claims"

const { useBreakpoint } = Grid

export default function MyClaimsPage() {
    useDocumentHead({ title: "My Claims — Tunse Challenge" })
    const navigate = useNavigate()
    const screens = useBreakpoint()
    const [statusFilter, setStatusFilter] = useState<ClaimStatus | "all">("all")
    const [search, setSearch] = useState("")

    const { data: myClaims = [], isLoading } = useMyClaims()
    const { data: mySubmissions = [] } = useCommunitySubmissions()
    const { data: phases = [] } = usePhases()

    const filtered = useMemo(
        () =>
            myClaims
                .filter((c) => statusFilter === "all" || c.status === statusFilter)
                .filter((c) => c.recruit_name.toLowerCase().includes(search.toLowerCase()))
                .sort((a, b) => b.created_at.localeCompare(a.created_at)),
        [myClaims, statusFilter, search],
    )

    const columns: ColumnsType<Claim> = [
        {
            title: "Recruit",
            dataIndex: "recruit_name",
            render: (_, c) => (
                <div className="flex items-center gap-2">
                    {c.category && <CategoryIcon categoryId={c.category} size={28} />}
                    <span>{c.recruit_name}</span>
                </div>
            ),
        },
        { title: "Type", render: (_, c) => c.claim_type?.label },
        { title: "Phase", render: (_, c) => phases.find((p) => p.id === c.phase_id)?.name },
        {
            title: "Submitted",
            dataIndex: "created_at",
            render: (v: string) => new Date(v).toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
        },
        { title: "Points", render: (_, c) => c.audited_points ?? c.provisional_points },
        {
            title: "Status",
            render: (_, c) =>
                c.status === "rejected" || c.status === "correction_requested" ? (
                    <Tooltip title={c.notes}>
                        <span>
                            <ClaimStatusTag status={c.status} />
                        </span>
                    </Tooltip>
                ) : (
                    <ClaimStatusTag status={c.status} />
                ),
        },
    ]

    const claimsView = (
        <>
            <Space wrap className="mb-4">
                <Input.Search
                    placeholder="Search by recruit name"
                    allowClear
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 220 }}
                />
                <Select
                    value={statusFilter}
                    onChange={setStatusFilter}
                    style={{ width: 200 }}
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

            {isLoading ? (
                <Spin />
            ) : !filtered.length ? (
                <Empty description="No claims match your filters" />
            ) : screens.md ? (
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={filtered}
                    onRow={(record) => ({ onClick: () => navigate(`/challenge/student/claims/${record.id}`) })}
                    rowClassName="cursor-pointer"
                    pagination={{ pageSize: 10 }}
                />
            ) : (
                <List
                    dataSource={filtered}
                    renderItem={(c) => (
                        <List.Item onClick={() => navigate(`/challenge/student/claims/${c.id}`)}>
                            <Card className="w-full" size="small">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-center gap-2">
                                        {c.category && <CategoryIcon categoryId={c.category} size={32} />}
                                        <div>
                                            <div className="font-medium">{c.recruit_name}</div>
                                            <div className="text-xs text-gray-500">{c.claim_type?.label}</div>
                                        </div>
                                    </div>
                                    <ClaimStatusTag status={c.status} />
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            )}
        </>
    )

    const communityView = mySubmissions.length ? (
        <List
            dataSource={mySubmissions}
            renderItem={(s) => (
                <List.Item>
                    <Card className="w-full" size="small">
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <div className="font-medium">{s.title}</div>
                                <div className="text-xs text-gray-500">
                                    {s.platform.toUpperCase()} · {new Date(s.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <Tag color={s.consent_confirmed ? "success" : "warning"}>
                                {s.consent_confirmed ? "Consent confirmed" : "Consent pending"}
                            </Tag>
                        </div>
                    </Card>
                </List.Item>
            )}
        />
    ) : (
        <Empty description="No community/social media submissions yet">
            <Link to="/challenge/student/community/new">Submit content</Link>
        </Empty>
    )

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-xl font-semibold mb-4">My Claims</h1>
            <Tabs
                items={[
                    { key: "claims", label: `Recruitment Claims (${myClaims.length})`, children: claimsView },
                    { key: "community", label: `Community Posts (${mySubmissions.length})`, children: communityView },
                ]}
            />
        </div>
    )
}
