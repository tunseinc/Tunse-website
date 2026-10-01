import { InboxOutlined } from "@ant-design/icons"
import {
    Alert,
    Button,
    Checkbox,
    Descriptions,
    Form,
    Input,
    Result,
    Select,
    Steps,
    Upload,
    type UploadFile,
} from "antd"
import { useState } from "react"
import { Link } from "react-router"
import useDocumentHead from "../../../hooks/use-document-head"
import { useInstitutions } from "../../../features/challenge/institutions/useInstitutions"
import { useStates } from "../../../features/challenge/reference/useReference"
import { useRegister } from "../../../features/challenge/auth/useAuth"

const GRADUATION_YEARS = Array.from({ length: 6 }, (_, i) => 2026 + i)

interface RegisterFormValues {
    fullName: string
    email: string
    password: string
    passwordConfirmation: string
    phone: string
    institutionId: number
    state: string
    studentIdNumber: string
    department: string
    graduationYear: number
    terms: boolean
}

export default function ChallengeRegisterPage() {
    useDocumentHead({ title: "Register — Tunse Challenge" })
    const [form] = Form.useForm<RegisterFormValues>()
    const [current, setCurrent] = useState(0)
    const [values, setValues] = useState<Partial<RegisterFormValues>>({})
    const [idFile, setIdFile] = useState<UploadFile | null>(null)
    const [challengeId, setChallengeId] = useState("")

    const { data: institutions = [] } = useInstitutions()
    const { data: states = [] } = useStates()
    const registerMutation = useRegister()

    const next = async () => {
        const fieldsByStep: (keyof RegisterFormValues)[][] = [
            ["fullName", "email", "phone", "password", "passwordConfirmation"],
            ["institutionId", "state", "department", "graduationYear"],
            ["studentIdNumber"],
        ]
        const fields = fieldsByStep[current]
        if (fields) {
            try {
                await form.validateFields(fields)
            } catch {
                return
            }
        }
        setValues({ ...values, ...form.getFieldsValue() })
        setCurrent((c) => c + 1)
    }

    const handleSubmit = () => {
        const all = { ...values, ...form.getFieldsValue() } as RegisterFormValues
        if (!idFile) return

        registerMutation.mutate(
            {
                full_name: all.fullName,
                email: all.email,
                password: all.password,
                password_confirmation: all.passwordConfirmation,
                phone: all.phone,
                institution_id: all.institutionId,
                state: all.state,
                department: all.department,
                graduation_year: all.graduationYear,
                student_id_number: all.studentIdNumber,
                student_id_file: idFile as unknown as File,
            },
            {
                onSuccess: (data) => setChallengeId(data.user.student_profile?.challenge_id ?? ""),
            },
        )
    }

    if (registerMutation.isSuccess) {
        const all = { ...values, ...form.getFieldsValue() } as RegisterFormValues
        const inst = institutions.find((i) => i.id === all.institutionId)
        return (
            <div className="max-w-lg mx-auto px-4 py-16">
                <Result
                    status="success"
                    title="Almost there — verify your email"
                    subTitle={
                        <span>
                            Your Challenge ID is <strong>{challengeId}</strong> — you'll need it on every
                            claim you submit for {inst?.name}. We've also sent a verification link to your
                            email; you'll need to confirm it before you can submit claims.
                        </span>
                    }
                    extra={
                        <Link to="/challenge/student/dashboard">
                            <Button type="primary" shape="round" size="large">
                                Go to my dashboard
                            </Button>
                        </Link>
                    }
                />
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
            <h1 className="text-2xl font-semibold mb-1 text-center">Register for the Challenge</h1>
            <p className="text-gray-500 text-center mb-8">
                Create your Challenge profile to start submitting recruitment claims.
            </p>
            <Steps
                current={current}
                items={[
                    { title: "Account" },
                    { title: "Institution" },
                    { title: "ID Verification" },
                    { title: "Review" },
                ]}
                className="mb-8"
                responsive
            />
            {registerMutation.isError && (
                <Alert
                    type="error"
                    showIcon
                    className="mb-4"
                    message="Registration failed"
                    description="Please check your details and try again."
                />
            )}
            <Form form={form} layout="vertical" initialValues={values} size="large">
                {current === 0 && (
                    <>
                        <Form.Item label="Full name" name="fullName" rules={[{ required: true }]}>
                            <Input placeholder="Your full name" />
                        </Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
                            <Input placeholder="you@example.edu.ng" />
                        </Form.Item>
                        <Form.Item
                            label="Phone / WhatsApp"
                            name="phone"
                            rules={[{ required: true }]}
                        >
                            <Input addonBefore="+234" placeholder="801 234 5678" />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, min: 8, message: "At least 8 characters" }]}
                        >
                            <Input.Password placeholder="Create a password" />
                        </Form.Item>
                        <Form.Item
                            label="Confirm password"
                            name="passwordConfirmation"
                            dependencies={["password"]}
                            rules={[
                                { required: true },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve()
                                        }
                                        return Promise.reject(new Error("Passwords do not match"))
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Re-enter your password" />
                        </Form.Item>
                    </>
                )}

                {current === 1 && (
                    <>
                        <Form.Item label="Institution" name="institutionId" rules={[{ required: true }]}>
                            <Select
                                placeholder="Select your institution"
                                options={institutions.map((i) => ({ value: i.id, label: i.name }))}
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                        <Form.Item label="State" name="state" rules={[{ required: true }]}>
                            <Select
                                placeholder="Select state"
                                options={states.map((s) => ({ value: s.state, label: s.state }))}
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                        <Form.Item label="Department / Course" name="department" rules={[{ required: true }]}>
                            <Input placeholder="e.g. Computer Science" />
                        </Form.Item>
                        <Form.Item
                            label="Expected graduation year"
                            name="graduationYear"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="Select year"
                                options={GRADUATION_YEARS.map((y) => ({ value: y, label: String(y) }))}
                            />
                        </Form.Item>
                    </>
                )}

                {current === 2 && (
                    <>
                        <Form.Item
                            label="Student ID number"
                            name="studentIdNumber"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Your matriculation / student ID number" />
                        </Form.Item>
                        <Form.Item
                            label="Student ID upload"
                            required
                            validateStatus={!idFile ? "error" : undefined}
                            help={!idFile ? "Please upload your student ID" : undefined}
                        >
                            <Upload.Dragger
                                accept="image/*,.pdf"
                                maxCount={1}
                                beforeUpload={(file) => {
                                    setIdFile(file as unknown as UploadFile)
                                    return false
                                }}
                                onRemove={() => setIdFile(null)}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag your student ID to upload</p>
                                <p className="ant-upload-hint text-xs">
                                    Used only to verify your enrollment — never shared for recruitment claims.
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                    </>
                )}

                {current === 3 && (
                    <>
                        <Descriptions bordered column={1} size="small" className="mb-4">
                            <Descriptions.Item label="Full name">{form.getFieldValue("fullName")}</Descriptions.Item>
                            <Descriptions.Item label="Email">{form.getFieldValue("email")}</Descriptions.Item>
                            <Descriptions.Item label="Phone">+234 {form.getFieldValue("phone")}</Descriptions.Item>
                            <Descriptions.Item label="Institution">
                                {institutions.find((i) => i.id === form.getFieldValue("institutionId"))?.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Department">{form.getFieldValue("department")}</Descriptions.Item>
                            <Descriptions.Item label="Graduation year">{form.getFieldValue("graduationYear")}</Descriptions.Item>
                            <Descriptions.Item label="Student ID number">{form.getFieldValue("studentIdNumber")}</Descriptions.Item>
                            <Descriptions.Item label="Student ID file">{idFile?.name ?? "Not uploaded"}</Descriptions.Item>
                        </Descriptions>
                        <Form.Item
                            name="terms"
                            valuePropName="checked"
                            rules={[{ validator: (_, v) => (v ? Promise.resolve() : Promise.reject(new Error("Required"))) }]}
                        >
                            <Checkbox>
                                I confirm this information is accurate and I accept the Challenge{" "}
                                <Link to="/challenge/rules">terms and rules</Link>.
                            </Checkbox>
                        </Form.Item>
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
                    {current < 3 ? (
                        <Button type="primary" shape="round" onClick={next}>
                            Continue
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            shape="round"
                            onClick={handleSubmit}
                            loading={registerMutation.isPending}
                        >
                            Complete registration
                        </Button>
                    )}
                </div>
            </Form>
        </div>
    )
}
