import { Alert, Button, Card, Descriptions, Empty, Form, Result, Steps } from "antd"
import dayjs from "dayjs"
import { useState } from "react"
import { Link } from "react-router"
import { DeclarationCheckbox } from "../../../components/challenge/student/ClaimForm/DeclarationCheckbox"
import { EvidenceUpload } from "../../../components/challenge/student/ClaimForm/EvidenceUpload"
import { Phase1ClaimFields } from "../../../components/challenge/student/ClaimForm/Phase1ClaimFields"
import { Phase2ClaimFields } from "../../../components/challenge/student/ClaimForm/Phase2ClaimFields"
import { Phase3ClaimFields } from "../../../components/challenge/student/ClaimForm/Phase3ClaimFields"
import { priorityCategories } from "../../../data/challenge"
import useDocumentHead from "../../../hooks/use-document-head"
import { useActivePhase } from "../../../features/challenge/phases/usePhases"
import { useClaimTypesForPhase } from "../../../features/challenge/claimTypes/useClaimTypes"
import { useSubmitClaim } from "../../../features/challenge/claims/useClaims"
import { useAuthStore } from "../../../stores/authStore"

export default function SubmitClaimPage() {
    useDocumentHead({ title: "Submit a Claim — Tunse Challenge" })
    const { data: phase } = useActivePhase()
    const { data: claimTypes = [] } = useClaimTypesForPhase(phase?.id)
    const submitMutation = useSubmitClaim()
    const challengeId = useAuthStore((s) => s.user?.student_profile?.challenge_id)
    const [form] = Form.useForm()
    const [current, setCurrent] = useState(0)

    if (!phase) {
        return (
            <div className="max-w-lg mx-auto py-16">
                <Empty description="No phase is currently open for claim submissions. Check back once the next phase opens.">
                    <Link to="/challenge/student/dashboard">
                        <Button shape="round">Back to dashboard</Button>
                    </Link>
                </Empty>
            </div>
        )
    }

    const next = async () => {
        const step0Fields = ["claimTypeId", "recruitName", "recruitPhone", "state", "lga", "category", "dateRecruited"]
        if (current === 0) {
            try {
                await form.validateFields(step0Fields)
            } catch {
                return
            }
        }
        if (current === 1) await form.validateFields(["evidencePhoto"]).catch(() => undefined)
        setCurrent((c) => c + 1)
    }

    const handleSubmit = async () => {
        try {
            await form.validateFields(["declaration"])
        } catch {
            return
        }
        const values = form.getFieldsValue()
        const photoFile = values.evidencePhoto?.[0]?.originFileObj as File | undefined

        submitMutation.mutate({
            claim_type_id: values.claimTypeId,
            recruit_name: values.recruitName,
            recruit_phone: values.recruitPhone,
            state: values.state,
            lga: values.lga,
            category: values.category,
            date_recruited: dayjs(values.dateRecruited).format("YYYY-MM-DD"),
            photo: photoFile,
            notes: values.notes,
            declaration: values.declaration,
            tworker_phone: values.tworkerPhone,
            transaction_reference: values.transactionReference,
            approx_value: values.approxValue,
            rating: values.rating,
        })
    }

    if (submitMutation.isSuccess) {
        const values = form.getFieldsValue()
        const claimType = claimTypes.find((ct) => ct.id === values.claimTypeId)
        return (
            <div className="max-w-lg mx-auto py-12">
                <Result
                    status="success"
                    title="Claim submitted"
                    subTitle={`${values.recruitName} has been recorded as a ${claimType?.label ?? "claim"} for ${challengeId ?? "your profile"}. Points are provisional until Tunse validates this entry.`}
                    extra={[
                        <Link to="/challenge/student/claims" key="claims">
                            <Button type="primary" shape="round">
                                View my claims
                            </Button>
                        </Link>,
                        <Link to="/challenge/student/claims/new" key="new">
                            <Button
                                shape="round"
                                onClick={() => {
                                    form.resetFields()
                                    submitMutation.reset()
                                    setCurrent(0)
                                }}
                            >
                                Submit another
                            </Button>
                        </Link>,
                    ]}
                />
            </div>
        )
    }

    const values = form.getFieldsValue()
    const claimType = claimTypes.find((ct) => ct.id === values.claimTypeId)
    const category = priorityCategories.find((c) => c.id === values.category)

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-semibold mb-1">Submit a Claim — {phase.name}</h1>
            <p className="text-gray-500 text-sm mb-6">{phase.prize_text}</p>

            <Steps
                current={current}
                items={[{ title: "Recruit Details" }, { title: "Evidence" }, { title: "Declare & Submit" }]}
                className="mb-6"
                responsive
            />

            {submitMutation.isError && (
                <Alert
                    type="error"
                    showIcon
                    className="mb-4"
                    message="Could not submit claim"
                    description="Please check your details — this recruit or claim may already be on file."
                />
            )}

            <Card>
                <Form form={form} layout="vertical" size="large">
                    <div className={current === 0 ? "" : "hidden"}>
                        {phase.number === 1 && <Phase1ClaimFields phaseId={phase.id} />}
                        {phase.number === 2 && <Phase2ClaimFields phaseId={phase.id} />}
                        {phase.number === 3 && <Phase3ClaimFields phaseId={phase.id} />}
                    </div>

                    {current === 1 && <EvidenceUpload />}

                    {current === 2 && (
                        <>
                            <Descriptions bordered size="small" column={1} className="mb-4">
                                <Descriptions.Item label="Claim type">{claimType?.label}</Descriptions.Item>
                                <Descriptions.Item label="Recruit">{values.recruitName}</Descriptions.Item>
                                <Descriptions.Item label="Phone">+234 {values.recruitPhone}</Descriptions.Item>
                                {values.state && (
                                    <Descriptions.Item label="Location">
                                        {values.lga}, {values.state}
                                    </Descriptions.Item>
                                )}
                                {category && <Descriptions.Item label="Category">{category.label}</Descriptions.Item>}
                                {values.dateRecruited && (
                                    <Descriptions.Item label="Date">
                                        {dayjs(values.dateRecruited).format("D MMM YYYY")}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                            <Alert
                                type="warning"
                                showIcon
                                className="mb-4"
                                message="This claim is provisional until Tunse verifies it"
                                description="Tunse checks the recruit's phone number against the app/backend before this claim counts toward prizes."
                            />
                            <DeclarationCheckbox />
                        </>
                    )}

                    <div className="flex justify-between mt-6">
                        {current > 0 ? (
                            <Button shape="round" onClick={() => setCurrent((c) => c - 1)}>
                                Back
                            </Button>
                        ) : (
                            <span />
                        )}
                        {current < 2 ? (
                            <Button type="primary" shape="round" onClick={next}>
                                Continue
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                shape="round"
                                onClick={handleSubmit}
                                loading={submitMutation.isPending}
                            >
                                Submit claim
                            </Button>
                        )}
                    </div>
                </Form>
            </Card>
        </div>
    )
}
