import { Form, Input, InputNumber, Modal, Radio, Select } from "antd"
import { useEffect, useState } from "react"
import { usePhases } from "../../../features/challenge/phases/usePhases"
import { useInstitutions } from "../../../features/challenge/institutions/useInstitutions"
import { useIndividualLeaderboard } from "../../../features/challenge/leaderboards/useLeaderboards"
import { useCreateScoreAdjustment } from "../../../features/challenge/scoreAdjustments/useScoreAdjustments"

interface ScoreAdjustmentModalProps {
    open: boolean
    onClose: () => void
    defaultTargetType?: "user" | "institution"
    defaultTargetId?: number
    onAdjusted?: () => void
}

interface FormValues {
    targetType: "user" | "institution"
    targetId: number
    phaseId: number
    points: number
    reason: string
}

/** Modal+Form: manual score adjustment with a mandatory reason, recorded to
 * an append-only log (dev spec §11). Points can be negative (penalty) or
 * positive (bonus). Reusable from the Disqualifications page and elsewhere. */
export function ScoreAdjustmentModal({
    open,
    onClose,
    defaultTargetType = "user",
    defaultTargetId,
    onAdjusted,
}: ScoreAdjustmentModalProps) {
    const { data: phases = [] } = usePhases()
    const { data: institutions = [] } = useInstitutions()
    const [form] = Form.useForm<FormValues>()
    const targetType = Form.useWatch("targetType", form) ?? defaultTargetType
    const [phaseId, setPhaseId] = useState<number | undefined>()
    const { data: individualBoard } = useIndividualLeaderboard(phaseId)
    const createMutation = useCreateScoreAdjustment()

    useEffect(() => {
        if (open) {
            form.resetFields()
            form.setFieldsValue({ targetType: defaultTargetType, targetId: defaultTargetId, points: 0 })
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
                points: values.points,
                reason: values.reason,
            },
            {
                onSuccess: () => {
                    onAdjusted?.()
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
            title="Manual score adjustment"
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            confirmLoading={createMutation.isPending}
            okText="Apply adjustment"
            destroyOnHidden
        >
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
                <Form.Item name="points" label="Points (negative for a penalty)" rules={[{ required: true, message: "Enter a point value." }]}>
                    <InputNumber className="w-full" placeholder="e.g. 10 or -10" />
                </Form.Item>
                <Form.Item name="reason" label="Reason" rules={[{ required: true, message: "A reason is required." }]}>
                    <Input.TextArea rows={4} placeholder="Explain the reason for this adjustment..." />
                </Form.Item>
            </Form>
        </Modal>
    )
}
