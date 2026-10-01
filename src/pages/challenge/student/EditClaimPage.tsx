import { Alert, Button, Card, Empty, Form, Result, Spin } from "antd"
import dayjs from "dayjs"
import { useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { EvidenceUpload } from "../../../components/challenge/student/ClaimForm/EvidenceUpload"
import { Phase1ClaimFields } from "../../../components/challenge/student/ClaimForm/Phase1ClaimFields"
import { Phase2ClaimFields } from "../../../components/challenge/student/ClaimForm/Phase2ClaimFields"
import { Phase3ClaimFields } from "../../../components/challenge/student/ClaimForm/Phase3ClaimFields"
import useDocumentHead from "../../../hooks/use-document-head"
import { usePhases } from "../../../features/challenge/phases/usePhases"
import { useClaim, useUpdateClaim } from "../../../features/challenge/claims/useClaims"

/** Strips the leading +234 so the value matches the addonBefore="+234" inputs. */
function toLocalPhone(phone: string): string {
    return phone.replace(/^\+?234/, "")
}

export default function EditClaimPage() {
    useDocumentHead({ title: "Edit Claim — Tunse Challenge" })
    const { claimId } = useParams<{ claimId: string }>()
    const navigate = useNavigate()
    const { data: claim, isLoading } = useClaim(claimId ? Number(claimId) : undefined)
    const { data: phases = [] } = usePhases()
    const updateMutation = useUpdateClaim()
    const [form] = Form.useForm()

    const phase = phases.find((p) => p.id === claim?.phase_id)

    useEffect(() => {
        if (!claim) return
        form.setFieldsValue({
            claimTypeId: claim.claim_type.id,
            recruitName: claim.recruit_name,
            recruitPhone: toLocalPhone(claim.recruit_phone),
            state: claim.state,
            lga: claim.lga,
            category: claim.category ?? undefined,
            dateRecruited: dayjs(claim.date_recruited),
            notes: claim.notes ?? undefined,
            tworkerPhone: claim.tworker_phone ? toLocalPhone(claim.tworker_phone) : undefined,
            transactionReference: claim.transaction_reference ?? undefined,
            approxValue: claim.approx_value ? Number(claim.approx_value) : undefined,
            rating: claim.rating ?? undefined,
        })
    }, [claim, form])

    if (isLoading) {
        return <Spin className="flex justify-center mt-16" />
    }

    if (!claim) {
        return (
            <Result
                status="404"
                title="Claim not found"
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

    if (claim.status !== "submitted" && claim.status !== "correction_requested") {
        return (
            <div className="max-w-lg mx-auto py-16">
                <Empty description="This claim has already been audited and can no longer be edited.">
                    <Link to={`/challenge/student/claims/${claim.id}`}>
                        <Button shape="round">Back to claim</Button>
                    </Link>
                </Empty>
            </div>
        )
    }

    const handleSubmit = async () => {
        let values: ReturnType<typeof form.getFieldsValue>
        try {
            values = await form.validateFields()
        } catch {
            return
        }
        const photoFile = values.evidencePhoto?.[0]?.originFileObj as File | undefined

        updateMutation.mutate(
            {
                id: claim.id,
                payload: {
                    claim_type_id: values.claimTypeId,
                    recruit_name: values.recruitName,
                    recruit_phone: values.recruitPhone,
                    state: values.state,
                    lga: values.lga,
                    category: values.category,
                    date_recruited: dayjs(values.dateRecruited).format("YYYY-MM-DD"),
                    photo: photoFile,
                    notes: values.notes,
                    tworker_phone: values.tworkerPhone,
                    transaction_reference: values.transactionReference,
                    approx_value: values.approxValue,
                    rating: values.rating,
                },
            },
            { onSuccess: () => navigate(`/challenge/student/claims/${claim.id}`) },
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-semibold mb-1">Edit Claim</h1>
            <p className="text-gray-500 text-sm mb-6">
                {claim.status === "correction_requested"
                    ? "An auditor asked for a correction on this claim. Fix the details below and save to resubmit it for review."
                    : "This claim hasn't been audited yet, so you can correct any details before Tunse reviews it."}
            </p>

            {updateMutation.isError && (
                <Alert
                    type="error"
                    showIcon
                    className="mb-4"
                    message="Could not save changes"
                    description="Please check your details — this recruit or claim type may conflict with another claim."
                />
            )}

            <Card>
                <Form form={form} layout="vertical" size="large">
                    {phase?.number === 1 && <Phase1ClaimFields phaseId={phase.id} />}
                    {phase?.number === 2 && <Phase2ClaimFields phaseId={phase.id} />}
                    {phase?.number === 3 && <Phase3ClaimFields phaseId={phase.id} />}

                    <EvidenceUpload />

                    {claim.has_photo && (
                        <p className="text-xs text-gray-400 -mt-3 mb-4">
                            A photo is already on file for this claim. Upload a new one above only if you need to
                            replace it.
                        </p>
                    )}

                    <div className="flex justify-between mt-6">
                        <Link to={`/challenge/student/claims/${claim.id}`}>
                            <Button shape="round">Cancel</Button>
                        </Link>
                        <Button
                            type="primary"
                            shape="round"
                            onClick={handleSubmit}
                            loading={updateMutation.isPending}
                        >
                            {claim.status === "correction_requested" ? "Save & resubmit" : "Save changes"}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    )
}
