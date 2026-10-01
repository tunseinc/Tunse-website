import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FlagOutlined } from "@ant-design/icons"
import { Button, Form, Input, Modal, Space } from "antd"
import { useState } from "react"
import { useReviewClaim } from "../../../features/challenge/claims/useClaims"
import type { Claim, ReviewClaimPayload } from "../../../lib/api/claims"

type AuditOutcome = ReviewClaimPayload["outcome"]

interface ClaimReviewPanelProps {
    claim: Claim
    size?: "small" | "middle" | "large"
    onReviewed?: (outcome: AuditOutcome) => void
}

const ACTION_META: Record<
    AuditOutcome,
    { label: string; icon: React.ReactNode; okText: string; danger?: boolean; helper: string }
> = {
    verified: {
        label: "Verify",
        icon: <CheckCircleOutlined />,
        okText: "Confirm verification",
        helper: "Confirms the recruit's status against the Tunse backend and awards the claim type's full points.",
    },
    rejected: {
        label: "Reject",
        icon: <CloseCircleOutlined />,
        okText: "Confirm rejection",
        danger: true,
        helper: "Marks the claim as not eligible — audited points are set to 0.",
    },
    flagged: {
        label: "Flag",
        icon: <FlagOutlined />,
        okText: "Confirm flag",
        helper: "Sends the claim to the audit priority queue for closer review without a final decision.",
    },
    correction: {
        label: "Request Correction",
        icon: <EditOutlined />,
        okText: "Request correction",
        helper: "Asks the student to fix and resubmit claim details (e.g. a mistyped phone number).",
    },
}

/** One-click Verify / Reject / Flag / Request Correction action bar, shared
 * by the Claims Queue row action and the Admin Claim Detail page. Every
 * action requires an auditor note before it applies, per the dev spec's
 * "mandatory reason, immutable log" pattern. */
export function ClaimReviewPanel({ claim, size = "middle", onReviewed }: ClaimReviewPanelProps) {
    const [modalOutcome, setModalOutcome] = useState<AuditOutcome | null>(null)
    const [form] = Form.useForm<{ auditNotes: string; backendLookupKey?: string }>()
    const reviewMutation = useReviewClaim()

    const openModal = (outcome: AuditOutcome) => {
        form.resetFields()
        setModalOutcome(outcome)
    }

    const handleSubmit = async () => {
        if (!modalOutcome) return
        const values = await form.validateFields()
        reviewMutation.mutate(
            {
                id: claim.id,
                payload: {
                    outcome: modalOutcome,
                    audit_notes: values.auditNotes,
                    backend_lookup_key: values.backendLookupKey,
                },
            },
            {
                onSuccess: () => {
                    onReviewed?.(modalOutcome)
                    setModalOutcome(null)
                },
            },
        )
    }

    return (
        <>
            <Space wrap size={size === "small" ? "small" : "middle"}>
                <Button type="primary" size={size} icon={ACTION_META.verified.icon} onClick={() => openModal("verified")}>
                    Verify
                </Button>
                <Button danger size={size} icon={ACTION_META.rejected.icon} onClick={() => openModal("rejected")}>
                    Reject
                </Button>
                <Button size={size} icon={ACTION_META.flagged.icon} onClick={() => openModal("flagged")}>
                    Flag
                </Button>
                <Button size={size} icon={ACTION_META.correction.icon} onClick={() => openModal("correction")}>
                    Request Correction
                </Button>
            </Space>

            <Modal
                title={modalOutcome ? `${ACTION_META[modalOutcome].label} claim ${claim.id}` : ""}
                open={!!modalOutcome}
                onCancel={() => setModalOutcome(null)}
                onOk={handleSubmit}
                confirmLoading={reviewMutation.isPending}
                okText={modalOutcome ? ACTION_META[modalOutcome].okText : "Confirm"}
                okButtonProps={{ danger: modalOutcome === "rejected" }}
                destroyOnHidden
            >
                {modalOutcome && <p className="text-gray-500 text-sm mb-3">{ACTION_META[modalOutcome].helper}</p>}
                <Form form={form} layout="vertical">
                    <Form.Item name="backendLookupKey" label="Backend lookup key (optional)">
                        <Input placeholder="e.g. the phone number you looked up on the Tunse backend" />
                    </Form.Item>
                    <Form.Item
                        name="auditNotes"
                        label="Audit notes"
                        rules={[{ required: true, message: "Audit notes are required to record this decision." }]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Describe the backend lookup result and reasoning for this decision..."
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
