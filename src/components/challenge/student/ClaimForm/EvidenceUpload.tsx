import { CameraOutlined } from "@ant-design/icons"
import { Alert, Form, Input, Upload } from "antd"

interface EvidenceUploadProps {
    required?: boolean
}

export function EvidenceUpload({ required = false }: EvidenceUploadProps) {
    return (
        <>
            <Alert
                type="warning"
                showIcon
                className="mb-4"
                message="Get consent first"
                description="Only upload a photo of you with the recruit if they've agreed to it. Never collect government ID documents through this form."
            />
            <Form.Item
                label="Photo with recruit"
                name="evidencePhoto"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={required ? [{ required: true, message: "A photo is required for this claim type" }] : []}
                extra={required ? "Required for this claim type." : "Optional, but strengthens your claim during audit."}
            >
                <Upload.Dragger accept="image/*" maxCount={1} beforeUpload={() => false} listType="picture">
                    <p className="ant-upload-drag-icon">
                        <CameraOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag a photo to upload</p>
                </Upload.Dragger>
            </Form.Item>
            <Form.Item label="Notes (optional)" name="notes">
                <Input.TextArea rows={3} placeholder="Anything that helps us verify this claim" />
            </Form.Item>
        </>
    )
}
