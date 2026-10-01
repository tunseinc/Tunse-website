import { DatePicker, Form, Input, InputNumber, Rate, Select } from "antd"
import { useClaimTypesForPhase } from "../../../../features/challenge/claimTypes/useClaimTypes"
import { priorityCategories } from "../../../../data/challenge"
import { PointsPill } from "../../shared/PointsPill"

export function Phase3ClaimFields({ phaseId }: { phaseId: number }) {
    const form = Form.useFormInstance()
    const claimTypeId = Form.useWatch("claimTypeId", form)
    const { data: claimTypes = [] } = useClaimTypesForPhase(phaseId)
    const isRatedJob = claimTypes.find((ct) => ct.id === claimTypeId)?.code === "rated_job"

    return (
        <>
            <Form.Item
                label="What are you claiming?"
                name="claimTypeId"
                rules={[{ required: true, message: "Select a claim type" }]}
            >
                <Select
                    placeholder="Select claim type"
                    options={claimTypes.map((ct) => ({
                        value: ct.id,
                        label: (
                            <span className="flex items-center gap-2">
                                {ct.label} <PointsPill points={ct.base_points} />
                            </span>
                        ),
                    }))}
                />
            </Form.Item>

            <Form.Item label="Customer phone number" name="recruitPhone" rules={[{ required: true }]}>
                <Input addonBefore="+234" placeholder="801 234 5678" />
            </Form.Item>
            <Form.Item label="T-worker identifier / phone (if known)" name="tworkerPhone">
                <Input addonBefore="+234" placeholder="801 234 5678" />
            </Form.Item>
            <Form.Item label="Service category" name="category" rules={[{ required: true }]}>
                <Select
                    placeholder="Select category"
                    showSearch
                    optionFilterProp="label"
                    options={priorityCategories.map((c) => ({ value: c.id, label: c.label }))}
                />
            </Form.Item>
            <Form.Item label="Transaction / service date" name="dateRecruited" rules={[{ required: true }]}>
                <DatePicker className="w-full" disabledDate={(d) => d.isAfter(new Date())} />
            </Form.Item>
            <Form.Item label="Transaction reference (optional)" name="transactionReference">
                <Input placeholder="If available from the Tunse app" />
            </Form.Item>
            <Form.Item label="Approximate transaction value (optional)" name="approxValue">
                <InputNumber className="w-full" min={0} prefix="₦" placeholder="Only if reliably known" />
            </Form.Item>
            {isRatedJob && (
                <Form.Item label="Customer rating" name="rating" rules={[{ required: true }]}>
                    <Rate />
                </Form.Item>
            )}
        </>
    )
}
