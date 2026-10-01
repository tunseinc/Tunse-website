import { DatePicker, Form, Input, Radio, Select } from "antd"
import { useClaimTypesForPhase } from "../../../../features/challenge/claimTypes/useClaimTypes"
import { useStates } from "../../../../features/challenge/reference/useReference"
import { PointsPill } from "../../shared/PointsPill"

export function Phase2ClaimFields({ phaseId }: { phaseId: number }) {
    const form = Form.useFormInstance()
    const state = Form.useWatch("state", form)
    const claimTypeId = Form.useWatch("claimTypeId", form)
    const { data: claimTypes = [] } = useClaimTypesForPhase(phaseId)
    const { data: states = [] } = useStates()
    const isVendor = claimTypes.find((ct) => ct.id === claimTypeId)?.code === "qualified_vendor"

    return (
        <>
            <Form.Item
                label="What are you claiming?"
                name="claimTypeId"
                rules={[{ required: true, message: "Select a claim type" }]}
            >
                <Radio.Group buttonStyle="solid" className="w-full">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {claimTypes.map((ct) => (
                            <Radio.Button key={ct.id} value={ct.id} className="!flex-1 !h-auto !py-2 !text-center">
                                <div className="flex items-center justify-center gap-2">
                                    {ct.label} <PointsPill points={ct.base_points} />
                                </div>
                            </Radio.Button>
                        ))}
                    </div>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                label={isVendor ? "Business / vendor name" : "Recruit full name"}
                name="recruitName"
                rules={[{ required: true }]}
            >
                <Input placeholder={isVendor ? "Business name" : "Full name as registered on Tunse"} />
            </Form.Item>
            <Form.Item
                label="Phone number used on Tunse"
                name="recruitPhone"
                rules={[{ required: true }]}
            >
                <Input addonBefore="+234" placeholder="801 234 5678" />
            </Form.Item>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Form.Item label="State" name="state" rules={[{ required: true }]}>
                    <Select
                        placeholder="Select state"
                        options={states.map((s) => ({ value: s.state, label: s.state }))}
                        onChange={() => form.setFieldValue("lga", undefined)}
                    />
                </Form.Item>
                <Form.Item label="LGA" name="lga" rules={[{ required: true }]}>
                    <Select
                        placeholder={state ? "Select LGA" : "Select a state first"}
                        disabled={!state}
                        options={(states.find((s) => s.state === state)?.lgas ?? []).map((l) => ({
                            value: l,
                            label: l,
                        }))}
                    />
                </Form.Item>
            </div>
            {isVendor && (
                <Form.Item label="Vendor / business category" name="category" rules={[{ required: true }]}>
                    <Input placeholder="e.g. Building materials, tools, spare parts" />
                </Form.Item>
            )}
            <Form.Item label="Date recruited" name="dateRecruited" rules={[{ required: true }]}>
                <DatePicker className="w-full" disabledDate={(d) => d.isAfter(new Date())} />
            </Form.Item>
        </>
    )
}
