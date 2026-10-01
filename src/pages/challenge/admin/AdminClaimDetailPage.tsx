import { FileImageOutlined, UserOutlined } from "@ant-design/icons"
import { Alert, Avatar, Card, Col, Descriptions, Empty, Image, Result, Row, Spin, Tag, Timeline } from "antd"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { ClaimReviewPanel } from "../../../components/challenge/admin/ClaimReviewPanel"
import { CategoryIcon } from "../../../components/challenge/shared/CategoryIcon"
import { ClaimStatusTag } from "../../../components/challenge/shared/ClaimStatusTag"
import { PointsPill } from "../../../components/challenge/shared/PointsPill"
import { useClaim } from "../../../features/challenge/claims/useClaims"
import { usePhases } from "../../../features/challenge/phases/usePhases"
import { claimPhotoPath, fetchProtectedFileUrl } from "../../../lib/api/files"
import useDocumentHead from "../../../hooks/use-document-head"

const AUDIT_OUTCOME_COLOR: Record<string, string> = {
    verified: "green",
    rejected: "red",
    flagged: "orange",
    correction: "blue",
}

export default function AdminClaimDetailPage() {
    const { claimId } = useParams<{ claimId: string }>()
    const { data: claim, isLoading } = useClaim(claimId ? Number(claimId) : undefined)
    const { data: phases = [] } = usePhases()
    const [photoUrl, setPhotoUrl] = useState<string | null>(null)

    useDocumentHead({
        title: claim ? `Claim ${claim.id} — Tunse Challenge Admin` : "Claim — Tunse Challenge Admin",
    })

    useEffect(() => {
        if (!claim?.has_photo) return
        let objectUrl: string | null = null
        fetchProtectedFileUrl(claimPhotoPath(claim.id)).then((url) => {
            objectUrl = url
            setPhotoUrl(url)
        })
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [claim?.has_photo, claim?.id])

    if (isLoading) {
        return <Spin className="flex justify-center mt-16" />
    }

    if (!claim) {
        return (
            <Result
                status="404"
                title="Claim not found"
                subTitle={`No claim exists with id "${claimId}".`}
                extra={<Link to="/challenge/admin/claims">Back to Claims Queue</Link>}
            />
        )
    }

    const phase = phases.find((p) => p.id === claim.phase_id)
    const claimAudits = [...(claim.audits ?? [])].sort((a, b) => a.audited_at.localeCompare(b.audited_at))
    const duplicates = claim.duplicate_warnings ?? []

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    {claim.category && <CategoryIcon categoryId={claim.category} size={40} />}
                    <div>
                        <h1 className="text-xl font-semibold m-0">{claim.recruit_name}</h1>
                        <p className="text-gray-500 text-sm m-0">
                            Claim {claim.id} · {claim.claim_type?.label}
                        </p>
                    </div>
                </div>
                <ClaimStatusTag status={claim.status} />
            </div>

            {duplicates.length > 0 && (
                <Alert
                    type="warning"
                    showIcon
                    message="Duplicate recruit phone number"
                    description={
                        <div>
                            <p className="m-0 mb-2">
                                {claim.recruit_phone} was also claimed on {duplicates.length} other claim(s). Per
                                the attribution rule, the earliest valid claim should hold attribution unless an
                                admin resolves the dispute.
                            </p>
                            <ul className="m-0 pl-4">
                                {duplicates.map((d) => (
                                    <li key={d.claim_id}>
                                        <Link to={`/challenge/admin/claims/${d.claim_id}`}>
                                            Claim {d.claim_id} — {d.student_name ?? "Unknown student"}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                />
            )}

            <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                    <Card title="Claim details">
                        <Descriptions bordered column={{ xs: 1, md: 2 }} size="small">
                            <Descriptions.Item label="Recruit name">{claim.recruit_name}</Descriptions.Item>
                            <Descriptions.Item label="Recruit phone">{claim.recruit_phone}</Descriptions.Item>
                            <Descriptions.Item label="State">{claim.state}</Descriptions.Item>
                            <Descriptions.Item label="LGA">{claim.lga}</Descriptions.Item>
                            {claim.category && <Descriptions.Item label="Category">{claim.category}</Descriptions.Item>}
                            <Descriptions.Item label="Date recruited">
                                {new Date(claim.date_recruited).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phase">{phase?.name}</Descriptions.Item>
                            <Descriptions.Item label="Claim type">{claim.claim_type?.label}</Descriptions.Item>
                            <Descriptions.Item label="Provisional points">
                                <PointsPill points={claim.provisional_points} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Audited points">
                                {claim.audited_points === null || claim.audited_points === undefined ? (
                                    <Tag>Not yet audited</Tag>
                                ) : (
                                    <PointsPill points={claim.audited_points} />
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Declared at">
                                {new Date(claim.declaration_at).toLocaleString("en-NG")}
                            </Descriptions.Item>
                            <Descriptions.Item label="Submitted at">
                                {new Date(claim.created_at).toLocaleString("en-NG")}
                            </Descriptions.Item>
                            {claim.transaction_reference && (
                                <Descriptions.Item label="Transaction reference">{claim.transaction_reference}</Descriptions.Item>
                            )}
                            {claim.approx_value !== null && claim.approx_value !== undefined && (
                                <Descriptions.Item label="Approx. value">{"₦"}{Number(claim.approx_value).toLocaleString()}</Descriptions.Item>
                            )}
                            {claim.rating !== null && claim.rating !== undefined && (
                                <Descriptions.Item label="Rating">{claim.rating} / 5</Descriptions.Item>
                            )}
                            {claim.notes && (
                                <Descriptions.Item label="Notes" span={2}>
                                    {claim.notes}
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    </Card>

                    <Card title="Evidence" className="mt-4">
                        {photoUrl ? (
                            <Image src={photoUrl} alt="Claim evidence" width={240} />
                        ) : (
                            <Empty
                                image={<FileImageOutlined className="text-4xl text-gray-300" />}
                                description="No evidence photo attached to this claim."
                            />
                        )}
                    </Card>

                    <Card title="Audit history" className="mt-4">
                        {claimAudits.length ? (
                            <Timeline
                                items={claimAudits.map((a) => ({
                                    color: AUDIT_OUTCOME_COLOR[a.outcome] ?? "gray",
                                    children: (
                                        <div>
                                            <div className="font-medium capitalize">{a.outcome.replace("_", " ")}</div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(a.audited_at).toLocaleString("en-NG")}
                                                {a.backend_lookup_key ? ` · lookup key: ${a.backend_lookup_key}` : ""}
                                            </div>
                                            <p className="mt-1 mb-0 text-sm">{a.audit_notes}</p>
                                        </div>
                                    ),
                                }))}
                            />
                        ) : (
                            <Empty description="No audit actions recorded yet." />
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card title="Submitting student">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <Avatar icon={<UserOutlined />} />
                                <div>
                                    <div className="font-medium">{claim.student_name}</div>
                                    <div className="text-xs text-gray-500">{claim.student_profile?.challenge_id}</div>
                                </div>
                            </div>
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Institution">{claim.institution_name ?? "Unknown"}</Descriptions.Item>
                                <Descriptions.Item label="Department">{claim.student_profile?.department}</Descriptions.Item>
                                <Descriptions.Item label="Email">{claim.student_email}</Descriptions.Item>
                                <Descriptions.Item label="Phone">{claim.student_profile?.phone}</Descriptions.Item>
                                <Descriptions.Item label="Status">
                                    <Tag color={claim.student_profile?.status === "disqualified" ? "error" : "success"}>
                                        {claim.student_profile?.status}
                                    </Tag>
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                    </Card>

                    <Card title="Review this claim" className="mt-4">
                        <ClaimReviewPanel claim={claim} size="middle" />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
