import { Checkbox, Form } from "antd"

export function DeclarationCheckbox() {
    return (
        <Form.Item
            name="declaration"
            valuePropName="checked"
            rules={[
                {
                    validator: (_, value) =>
                        value ? Promise.resolve() : Promise.reject(new Error("You must confirm this declaration")),
                },
            ]}
        >
            <Checkbox>
                I confirm this recruitment is genuine and understand that false submissions can lose
                points or lead to disqualification.
            </Checkbox>
        </Form.Item>
    )
}
