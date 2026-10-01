import { Alert, Form, Input, Modal, Radio, Select } from "antd"
import { useEffect, useState } from "react"
import { usePhases } from "../../../features/challenge/phases/usePhases"
import { useInstitutions } from "../../../features/challenge/institutions/useInstitutions"
import { useIndividualLeaderboard } from "../../../features/challenge/leaderboards/useLeaderboards"
import { useCreateDisqualification } from "../../../features/challenge/disqualifications/useDisqualifications"

interface DisqualifyModalProps {
    open: boolean
    onClose: () => void
    defaultTargetType?: "user" | "institution"
    defaultTargetId?: number
    onDisqualified?: () => void
}

interface FormValues {
    targetType: "user" | "institution"
    targetId: number
    phaseId: number
    reason: string
}

/** Modal+Form: disqualify a student or institution with a mandatory reason
 * (dev spec §11). Reusable from the Disqualifications page, the
 * Institutions page, and (where natural) the Claims Queue. */
export function DisqualifyModal({
    open,
    onClose,
    defaultTargetType = "user",
    defaultTargetId,
    onDisqualified,
}: DisqualifyModalProps) {
    const { data: phases = [] } = usePhases()
    const { data: institutions = [] } = useInstitutions()
    const [form] = Form.useForm<FormValues>()
    const targetType = Form.useWatch("targetType", form) ?? defaultTargetType
    const [phaseId, setPhaseId] = useState<number | undefined>()
    const { data: individualBoard } = useIndividualLeaderboard(phaseId)
    const createMutation = useCreateDisqualification()

    useEffect(() => {
        if (open) {
            form.resetFields()
            form.setFieldsValue({ targetType: defaultTargetType, targetId: defaultTargetId })
            setPhaseId(undefined)
        }
    }, [open, defaultTargetType, defaultTargetId, form])

    const handleSubmit = async () => {
        const values = await form.validateFields()
        createMutation.mutate(
            {
                targetable_type: values.targetType,
                targetable_id: values.targetId,
                phase_id: values.phaseId,
                reason: values.reason,
            },
            {
                onSuccess: () => {
                    onDisqualified?.()
                    onClose()
                },
            },
        )
    }

    const targetOptions =
        targetType === "user"
            ? (individualBoard?.data ?? []).map((u) => ({ value: u.user_id, label: `${u.full_name} (${u.challenge_id})` }))
            : institutions.map((i) => ({ value: i.id, label: i.name }))

    return (
        <Modal
            title="Disqualify"
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            confirmLoading={createMutation.isPending}
            okText="Disqualify"
            okButtonProps={{ danger: true }}
            destroyOnHidden
        >
            <Alert
                type="warning"
                showIcon
                className="mb-4"
                message="Disqualification excludes this target's score from all leaderboards until reinstated."
            />
            <Form form={form} layout="vertical">
                <Form.Item name="targetType" label="Target type" rules={[{ required: true }]}>
                    <Radio.Group
                        options={[
                            { value: "user", label: "Student" },
                            { value: "institution", label: "Institution" },
                        ]}
                        onChange={() => form.setFieldValue("targetId", undefined)}
                    />
                </Form.Item>
                <Form.Item name="phaseId" label="Phase" rules={[{ required: true, message: "Select a phase." }]}>
                    <Select
                        options={phases.map((p) => ({ value: p.id, label: p.name }))}
                        placeholder="Select phase"
                        onChange={(value) => setPhaseId(value)}
                    />
                </Form.Item>
                <Form.Item
                    name="targetId"
                    label={targetType === "user" ? "Student" : "Institution"}
                    rules={[{ required: true, message: "Select a target." }]}
                >
                    <Select
                        showSearch
                        options={targetOptions}
                        placeholder={targetType === "user" && !phaseId ? "Select a phase first" : "Search..."}
                        optionFilterProp="label"
                        disabled={targetType === "user" && !phaseId}
                    />
                </Form.Item>
                <Form.Item name="reason" label="Reason" rules={[{ required: true, message: "A reason is required." }]}>
                    <Input.TextArea rows={4} placeholder="Explain why this target is being disqualified..." />
                </Form.Item>
            </Form>
        </Modal>
    )
}
