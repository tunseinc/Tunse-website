import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons"
import { Alert, Button, Card, Descriptions, Empty, Image, Result, Spin, Timeline } from "antd"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { CategoryIcon } from "../../../components/challenge/shared/CategoryIcon"
import { ClaimStatusTag } from "../../../components/challenge/shared/ClaimStatusTag"
import { PointsPill } from "../../../components/challenge/shared/PointsPill"
import { ProvisionalBadge } from "../../../components/challenge/shared/ProvisionalBadge"
import { categoryById } from "../../../data/challenge"
import useDocumentHead from "../../../hooks/use-document-head"
import { useClaim } from "../../../features/challenge/claims/useClaims"
import { usePhases } from "../../../features/challenge/phases/usePhases"
import { claimPhotoPath, fetchProtectedFileUrl } from "../../../lib/api/files"
import type { Audit } from "../../../lib/api/claims"

const OUTCOME_META: Record<Audit["outcome"], { color: string; label: string }> = {
    verified: { color: "green", label: "Verified" },
    rejected: { color: "red", label: "Rejected" },
    flagged: { color: "orange", label: "Flagged for review" },
    correction: { color: "blue", label: "Correction requested" },
}

export default function ClaimDetailPage() {
    useDocumentHead({ title: "Claim Detail — Tunse Challenge" })
    const { claimId } = useParams<{ claimId: string }>()
    const { data: claim, isLoading } = useClaim(claimId ? Number(claimId) : undefined)
    const { data: phases = [] } = usePhases()
    const [photoUrl, setPhotoUrl] = useState<string | null>(null)

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
                subTitle="This claim doesn't exist or may have been removed."
                extra={
                    <Link to="/challenge/student/claims">
                        <Button type="primary" shape="round">
                            Back to My Claims
                        </Button>
                    </Link>
                }
            />
        )
    }

    const phase = phases.find((p) => p.id === claim.phase_id)
    const category = claim.category ? categoryById(claim.category) : undefined
    const audits = [...(claim.audits ?? [])].sort((a, b) => a.audited_at.localeCompare(b.audited_at))

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <Link
                to="/challenge/student/claims"
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#668A44] w-fit"
            >
                <ArrowLeftOutlined /> Back to My Claims
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold m-0">{claim.recruit_name}</h1>
                    <p className="text-gray-500 text-sm m-0">
                        Claim {claim.id} &middot; {claim.claim_type?.label ?? "Unknown claim type"}
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <ClaimStatusTag status={claim.status} />
                    {phase && <ProvisionalBadge phaseStatus={phase.status} />}
                    {(claim.status === "submitted" || claim.status === "correction_requested") && (
                        <Link to={`/challenge/student/claims/${claim.id}/edit`}>
                            <Button icon={<EditOutlined />} shape="round" size="small">
                                Edit claim
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {claim.status === "submitted" && (
                <Alert
                    type="info"
                    showIcon
                    message="Spotted a mistake?"
                    description="This claim hasn't been audited yet, so you can still edit it if you made an error."
                />
            )}

            {claim.status === "rejected" && (
                <Alert
                    type="error"
                    showIcon
                    message="Claim rejected"
                    description={claim.notes ?? "This claim was rejected during audit. Points have been removed."}
                />
            )}
            {claim.status === "correction_requested" && (
                <Alert
                    type="warning"
                    showIcon
                    message="Correction requested"
                    description={
                        <span>
                            {claim.notes ?? "Tunse has requested a correction on this claim (likely a data-entry error)."}{" "}
                            Click <strong>Edit claim</strong> above to fix it and resubmit for review.
                        </span>
                    }
                />
            )}
            {claim.status === "flagged" && (
                <Alert
                    type="warning"
                    showIcon
                    message="Under higher-level review"
                    description={claim.notes ?? "This claim has been flagged as suspicious or ambiguous and needs further review."}
                />
            )}

            <Card title="Claim details">
                <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }} size="small">
                    <Descriptions.Item label="Recruit name">{claim.recruit_name}</Descriptions.Item>
                    <Descriptions.Item label="Recruit phone">{claim.recruit_phone}</Descriptions.Item>
                    <Descriptions.Item label="State / LGA">
                        {claim.state} / {claim.lga}
                    </Descriptions.Item>
                    <Descriptions.Item label="Category">
                        {category ? (
                            <div className="flex items-center gap-2">
                                <CategoryIcon categoryId={category.id} size={28} />
                                <span>{category.label}</span>
                            </div>
                        ) : (
                            "—"
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Date recruited">
                        {new Date(claim.date_recruited).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </Descriptions.Item>
                    <Descriptions.Item label="Claim type">{claim.claim_type?.label ?? "—"}</Descriptions.Item>
                    <Descriptions.Item label="Provisional points">
                        <PointsPill points={claim.provisional_points} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Audited points">
                        {claim.audited_points === null || claim.audited_points === undefined ? (
                            <span className="text-gray-400">Pending audit</span>
                        ) : (
                            <PointsPill points={claim.audited_points} />
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phase">{phase?.name ?? "—"}</Descriptions.Item>
                    <Descriptions.Item label="Submitted">
                        {new Date(claim.created_at).toLocaleString("en-NG")}
                    </Descriptions.Item>
                    {claim.transaction_reference && (
                        <Descriptions.Item label="Transaction reference">
                            {claim.transaction_reference}
                        </Descriptions.Item>
                    )}
                    {claim.approx_value !== null && claim.approx_value !== undefined && (
                        <Descriptions.Item label="Approx. value">
                            &#8358;{Number(claim.approx_value).toLocaleString("en-NG")}
                        </Descriptions.Item>
                    )}
                    {claim.rating !== null && claim.rating !== undefined && (
                        <Descriptions.Item label="Rating">{claim.rating} / 5</Descriptions.Item>
                    )}
                    <Descriptions.Item label="Notes" span={2}>
                        {claim.notes || "—"}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Evidence">
                {photoUrl ? (
                    <Image src={photoUrl} alt="Claim evidence" width={200} />
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No evidence photo on file for this claim."
                    />
                )}
            </Card>

            <Card title="Audit timeline">
                {audits.length ? (
                    <Timeline
                        items={audits.map((audit) => {
                            const meta = OUTCOME_META[audit.outcome]
                            return {
                                color: meta.color,
                                children: (
                                    <div>
                                        <div className="font-medium">{meta.label}</div>
                                        <div className="text-xs text-gray-500">
                                            {audit.auditor_name ?? "Tunse audit team"} &middot;{" "}
                                            {new Date(audit.audited_at).toLocaleString("en-NG")}
                                        </div>
                                        <div className="text-sm mt-1">{audit.audit_notes}</div>
                                        {audit.backend_lookup_key && (
                                            <div className="text-xs text-gray-400 mt-1">
                                                Backend lookup: {audit.backend_lookup_key}
                                            </div>
                                        )}
                                    </div>
                                ),
                            }
                        })}
                    />
                ) : (
                    <Empty description="Not yet audited — this claim is still pending review." />
                )}
            </Card>
        </div>
    )
}
