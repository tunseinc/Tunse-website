import { InboxOutlined } from "@ant-design/icons"
import {
    Alert,
    AutoComplete,
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
import { isAxiosError } from "axios"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"
import useDocumentHead from "../../../hooks/use-document-head"
import { universityCourses } from "../../../data/challenge"
import { useInstitutions } from "../../../features/challenge/institutions/useInstitutions"
import { useRegister } from "../../../features/challenge/auth/useAuth"
import type { ApiValidationError } from "../../../lib/api/client"

const FIRST_GRADUATION_YEAR = 2015
const GRADUATION_YEARS = Array.from(
    { length: new Date().getFullYear() + 6 - FIRST_GRADUATION_YEAR + 1 },
    (_, i) => FIRST_GRADUATION_YEAR + i,
)

/** Nigerian mobile: optional +234 / 234 / 0 prefix, then 10 digits starting 70/71/80/81/90/91. */
const NIGERIAN_MOBILE = /^(\+?234|0)?[789][01]\d{8}$/
const PERSON_NAME = /^[\p{L}\s.'-]+$/u
const ID_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf"]
const ID_FILE_MAX_BYTES = 5 * 1024 * 1024
const COURSE_OPTIONS = universityCourses.map((course) => ({ value: course }))

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

type FieldName = keyof RegisterFormValues

const FIELDS_BY_STEP: FieldName[][] = [
    ["fullName", "email", "phone", "password", "passwordConfirmation"],
    ["state", "institutionId", "department", "graduationYear"],
    ["studentIdNumber"],
]

/** Maps the API's snake_case validation keys to the form field (and wizard step) they belong to. */
const SERVER_FIELD_MAP: Record<string, { field?: FieldName; step: number }> = {
    full_name: { field: "fullName", step: 0 },
    email: { field: "email", step: 0 },
    phone: { field: "phone", step: 0 },
    password: { field: "password", step: 0 },
    institution_id: { field: "institutionId", step: 1 },
    state: { field: "state", step: 1 },
    department: { field: "department", step: 1 },
    graduation_year: { field: "graduationYear", step: 1 },
    student_id_number: { field: "studentIdNumber", step: 2 },
    student_id_file: { step: 2 },
}

const stripPhoneFormatting = (value: string) => value.replace(/[\s\-()]/g, "")
const trimmed = (value: unknown) => (typeof value === "string" ? value.trim() : value)

function idFileProblem(file: File): string | null {
    const name = file.name.toLowerCase()
    if (!ID_FILE_EXTENSIONS.some((ext) => name.endsWith(ext))) {
        return "Upload a JPG, PNG or PDF file."
    }
    if (file.size > ID_FILE_MAX_BYTES) {
        return "The file must be 5 MB or smaller."
    }
    return null
}

export default function ChallengeRegisterPage() {
    useDocumentHead({ title: "Register — Tunse Challenge" })
    const [form] = Form.useForm<RegisterFormValues>()
    const [current, setCurrent] = useState(0)
    const [values, setValues] = useState<Partial<RegisterFormValues>>({})
    const [idFile, setIdFile] = useState<UploadFile | null>(null)
    const [idFileError, setIdFileError] = useState<string | null>(null)
    const [challengeId, setChallengeId] = useState("")
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})

    const { data: institutions = [] } = useInstitutions()
    const registerMutation = useRegister()

    const selectedState = Form.useWatch("state", form) ?? values.state
    const stateOptions = useMemo(
        () => [...new Set(institutions.map((i) => i.state))].sort().map((s) => ({ value: s, label: s })),
        [institutions],
    )
    const institutionOptions = useMemo(
        () =>
            institutions
                .filter((i) => i.state === selectedState)
                .map((i) => ({ value: i.id, label: i.name })),
        [institutions, selectedState],
    )

    // Server errors for fields on the current step are applied once that step's inputs are mounted.
    useEffect(() => {
        const fieldErrors = Object.entries(serverErrors).flatMap(([key, messages]) => {
            const target = SERVER_FIELD_MAP[key]
            return target?.field && target.step === current ? [{ name: target.field, errors: messages }] : []
        })
        if (fieldErrors.length > 0) {
            form.setFields(fieldErrors)
        }
        if (current === 2 && serverErrors.student_id_file) {
            setIdFileError(serverErrors.student_id_file[0])
        }
    }, [current, serverErrors, form])

    const next = async () => {
        const fields = FIELDS_BY_STEP[current]
        let valid = true
        try {
            await form.validateFields(fields)
        } catch {
            valid = false
        }
        if (current === 2 && !idFile) {
            setIdFileError("Please upload your student ID.")
            valid = false
        }
        if (!valid) return

        setServerErrors((errors) =>
            Object.fromEntries(Object.entries(errors).filter(([key]) => SERVER_FIELD_MAP[key]?.step !== current)),
        )
        setValues({ ...values, ...form.getFieldsValue() })
        setCurrent((c) => c + 1)
    }

    const handleSubmit = async () => {
        try {
            await form.validateFields(["terms"])
        } catch {
            return
        }
        if (!idFile) {
            setIdFileError("Please upload your student ID.")
            setCurrent(2)
            return
        }

        const all = { ...values, ...form.getFieldsValue() } as RegisterFormValues
        setServerErrors({})

        registerMutation.mutate(
            {
                full_name: all.fullName.trim(),
                email: all.email.trim(),
                password: all.password,
                password_confirmation: all.passwordConfirmation,
                phone: stripPhoneFormatting(all.phone),
                institution_id: all.institutionId,
                state: all.state,
                department: all.department.trim(),
                graduation_year: all.graduationYear,
                student_id_number: all.studentIdNumber.trim(),
                student_id_file: idFile as unknown as File,
            },
            {
                onSuccess: (data) => setChallengeId(data.user.student_profile?.challenge_id ?? ""),
                onError: (error) => {
                    const errors = isAxiosError<ApiValidationError>(error) ? error.response?.data?.errors : undefined
                    if (!errors) return
                    setServerErrors(errors)
                    const steps = Object.keys(errors).map((key) => SERVER_FIELD_MAP[key]?.step ?? 3)
                    setCurrent(Math.min(...steps))
                },
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

    const serverMessages = Object.values(serverErrors).flat()
    const isValidationFailure =
        isAxiosError(registerMutation.error) && registerMutation.error.response?.status === 422
    const showErrorAlert = serverMessages.length > 0 || (registerMutation.isError && !isValidationFailure)

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
            {showErrorAlert && (
                <Alert
                    type="error"
                    showIcon
                    className="mb-4"
                    message="Registration failed"
                    description={
                        serverMessages.length > 0 ? (
                            <ul className="list-disc pl-5">
                                {serverMessages.map((message) => (
                                    <li key={message}>{message}</li>
                                ))}
                            </ul>
                        ) : (
                            "Something went wrong. Please check your connection and try again."
                        )
                    }
                />
            )}
            <Form form={form} layout="vertical" initialValues={values} size="large">
                {current === 0 && (
                    <>
                        <Form.Item
                            label="Full name"
                            name="fullName"
                            normalize={(v: string) => v.replace(/^\s+/, "")}
                            rules={[
                                { required: true, whitespace: true, message: "Enter your full name" },
                                { min: 3, message: "Name is too short" },
                                { max: 255, message: "Name is too long" },
                                { pattern: PERSON_NAME, message: "Use letters only (spaces, - ' and . are allowed)" },
                            ]}
                        >
                            <Input placeholder="Your full name" autoComplete="name" />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            normalize={trimmed}
                            rules={[
                                { required: true, message: "Enter your email address" },
                                { type: "email", message: "Enter a valid email address, e.g. you@example.com" },
                                { max: 255, message: "Email is too long" },
                            ]}
                        >
                            <Input type="email" placeholder="you@example.edu.ng" autoComplete="email" />
                        </Form.Item>
                        <Form.Item
                            label="Phone / WhatsApp"
                            name="phone"
                            rules={[
                                { required: true, message: "Enter your phone number" },
                                {
                                    validator: (_, value?: string) =>
                                        !value || NIGERIAN_MOBILE.test(stripPhoneFormatting(value))
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                  new Error("Enter a valid Nigerian mobile number, e.g. 0801 234 5678"),
                                              ),
                                },
                            ]}
                        >
                            <Input
                                addonBefore="+234"
                                placeholder="801 234 5678"
                                inputMode="tel"
                                autoComplete="tel-national"
                                maxLength={16}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: "Create a password" },
                                { min: 8, message: "At least 8 characters" },
                            ]}
                        >
                            <Input.Password placeholder="Create a password" autoComplete="new-password" />
                        </Form.Item>
                        <Form.Item
                            label="Confirm password"
                            name="passwordConfirmation"
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: "Re-enter your password" },
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
                            <Input.Password placeholder="Re-enter your password" autoComplete="new-password" />
                        </Form.Item>
                    </>
                )}

                {current === 1 && (
                    <>
                        <Form.Item
                            label="State of your institution"
                            name="state"
                            rules={[{ required: true, message: "Select the state your institution is in" }]}
                        >
                            <Select
                                placeholder="Select state"
                                options={stateOptions}
                                showSearch
                                optionFilterProp="label"
                                onChange={() => form.setFieldValue("institutionId", undefined)}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Institution"
                            name="institutionId"
                            rules={[{ required: true, message: "Select your institution" }]}
                        >
                            <Select
                                placeholder={selectedState ? "Select your institution" : "Select a state first"}
                                options={institutionOptions}
                                disabled={!selectedState}
                                showSearch
                                optionFilterProp="label"
                                notFoundContent="No institutions found in this state"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Department / Course"
                            name="department"
                            extra="Can't find your course? Type it in."
                            rules={[
                                { required: true, whitespace: true, message: "Enter your department or course" },
                                { max: 255, message: "Department is too long" },
                            ]}
                        >
                            <AutoComplete
                                placeholder="Search or type your course"
                                options={COURSE_OPTIONS}
                                filterOption={(input, option) =>
                                    (option?.value ?? "").toLowerCase().includes(input.trim().toLowerCase())
                                }
                            />
                        </Form.Item>
                        <Form.Item
                            label="Graduation year (completed or expected)"
                            name="graduationYear"
                            rules={[{ required: true, message: "Select your graduation year" }]}
                        >
                            <Select
                                placeholder="Select year"
                                options={GRADUATION_YEARS.map((y) => ({ value: y, label: String(y) }))}
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </>
                )}

                {current === 2 && (
                    <>
                        <Form.Item
                            label="Student ID number"
                            name="studentIdNumber"
                            rules={[
                                { required: true, whitespace: true, message: "Enter your student ID number" },
                                { max: 100, message: "Student ID number is too long" },
                            ]}
                        >
                            <Input placeholder="Your matriculation / student ID number" />
                        </Form.Item>
                        <Form.Item
                            label="Student ID upload"
                            required
                            validateStatus={idFileError ? "error" : undefined}
                            help={idFileError ?? "JPG, PNG or PDF, up to 5 MB"}
                        >
                            <Upload.Dragger
                                accept={ID_FILE_EXTENSIONS.join(",")}
                                maxCount={1}
                                fileList={idFile ? [idFile] : []}
                                beforeUpload={(file) => {
                                    const problem = idFileProblem(file)
                                    if (problem) {
                                        setIdFileError(problem)
                                        return Upload.LIST_IGNORE
                                    }
                                    setIdFile(file as unknown as UploadFile)
                                    setIdFileError(null)
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
                            <Descriptions.Item label="Phone">{form.getFieldValue("phone")}</Descriptions.Item>
                            <Descriptions.Item label="State">{form.getFieldValue("state")}</Descriptions.Item>
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
                            rules={[
                                {
                                    validator: (_, v) =>
                                        v ? Promise.resolve() : Promise.reject(new Error("You must accept the terms to continue")),
                                },
                            ]}
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
