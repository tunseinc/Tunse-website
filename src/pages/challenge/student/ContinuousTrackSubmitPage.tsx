import { InboxOutlined } from "@ant-design/icons"
import {
    Alert,
    Button,
    Card,
    Checkbox,
    Col,
    Form,
    Input,
    Progress,
    Result,
    Row,
    Select,
    Upload,
    type UploadFile,
} from "antd"
import { useState } from "react"
import { Link } from "react-router"
import useDocumentHead from "../../../hooks/use-document-head"
import { useSubmitCommunitySubmission } from "../../../features/challenge/community/useCommunitySubmissions"
import type { SubmitCommunitySubmissionPayload } from "../../../lib/api/communitySubmissions"

const { TextArea } = Input
const { Dragger } = Upload

const RUBRIC = [
    { label: "Innovation & creativity", weight: 30, color: "#668A44" },
    { label: "Public engagement", weight: 30, color: "#98BC77" },
    { label: "Message & brand relevance", weight: 20, color: "#F9AA33" },
    { label: "Consistency & participation", weight: 10, color: "#232332" },
    { label: "Community impact", weight: 10, color: "#CF4F4F" },
]

type SubmitFormValues = SubmitCommunitySubmissionPayload

export default function ContinuousTrackSubmitPage() {
    useDocumentHead({ title: "Submit Community Content — Tunse Challenge" })
    const [form] = Form.useForm<SubmitFormValues>()
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const submitMutation = useSubmitCommunitySubmission()

    const handleFinish = (values: SubmitFormValues) => {
        submitMutation.mutate(values)
    }

    const handleReset = () => {
        form.resetFields()
        setFileList([])
        submitMutation.reset()
    }

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
            <div>
                <h1 className="text-xl font-semibold m-0">Community & Social Media Engagement</h1>
                <p className="text-gray-500 text-sm m-0">
                    Log a post or content piece that recruited people into an official Tunse community, for
                    consideration in the continuous Community & Social Media Engagement Track.
                </p>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={14}>
                    <Card>
                        {submitMutation.isSuccess ? (
                            <Result
                                status="success"
                                title="Submission received"
                                subTitle="Your content has been logged for the Community & Social Media Engagement Track. It will be reviewed against the judging rubric alongside other entries."
                                extra={[
                                    <Button key="another" onClick={handleReset}>
                                        Submit another
                                    </Button>,
                                    <Link key="claims" to="/challenge/student/claims">
                                        <Button type="primary" shape="round">
                                            View my submissions
                                        </Button>
                                    </Link>,
                                ]}
                            />
                        ) : (
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleFinish}
                                initialValues={{ platform: "x", community_type: "tworkers" }}
                            >
                                {submitMutation.isError && (
                                    <Alert
                                        type="error"
                                        showIcon
                                        className="mb-4"
                                        message="Could not submit"
                                        description="Please check your details and try again."
                                    />
                                )}
                                <Form.Item
                                    label="Title"
                                    name="title"
                                    rules={[{ required: true, message: "Give this submission a short title" }]}
                                >
                                    <Input placeholder="e.g. Meet Yusuf: from side gigs to verified Tunse plumber" />
                                </Form.Item>

                                <Form.Item
                                    label="Platform"
                                    name="platform"
                                    rules={[{ required: true, message: "Select a platform" }]}
                                >
                                    <Select
                                        options={[
                                            { value: "x", label: "X (Twitter)" },
                                            { value: "facebook", label: "Facebook" },
                                            { value: "youtube", label: "YouTube" },
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Post URL"
                                    name="post_url"
                                    rules={[
                                        { required: true, message: "Paste a link to the post" },
                                        { type: "url", message: "Enter a valid URL" },
                                    ]}
                                >
                                    <Input placeholder="https://..." />
                                </Form.Item>

                                <Form.Item
                                    label="Community type"
                                    name="community_type"
                                    rules={[{ required: true, message: "Select who this content is for" }]}
                                >
                                    <Select
                                        options={[
                                            { value: "verifiers", label: "Verifiers" },
                                            { value: "tworkers", label: "T-workers" },
                                            { value: "customers", label: "Customers" },
                                            { value: "vendors", label: "Vendors" },
                                            { value: "students", label: "Students / coordinators" },
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item label="Screenshot / evidence (optional)">
                                    <Dragger
                                        multiple={false}
                                        maxCount={1}
                                        fileList={fileList}
                                        beforeUpload={() => false}
                                        onChange={({ fileList: fl }) => setFileList(fl)}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag a screenshot to attach</p>
                                        <p className="ant-upload-hint text-xs">
                                            Evidence is kept locally for now — only the link and description are
                                            submitted.
                                        </p>
                                    </Dragger>
                                </Form.Item>

                                <Form.Item
                                    label="Description"
                                    name="description"
                                    rules={[{ required: true, message: "Briefly describe this content" }]}
                                >
                                    <TextArea rows={3} placeholder="What is this post about, and who does it feature?" />
                                </Form.Item>

                                <Form.Item
                                    name="consent_confirmed"
                                    valuePropName="checked"
                                    rules={[
                                        {
                                            validator: (_, value) =>
                                                value
                                                    ? Promise.resolve()
                                                    : Promise.reject(
                                                        new Error(
                                                            "Confirm consent before submitting",
                                                        ),
                                                    ),
                                        },
                                    ]}
                                >
                                    <Checkbox>
                                        The recruit gave explicit consent to be added to this community / featured
                                        in this content.
                                    </Checkbox>
                                </Form.Item>

                                <Form.Item className="mb-0">
                                    <Button
                                        type="primary"
                                        shape="round"
                                        htmlType="submit"
                                        block
                                        loading={submitMutation.isPending}
                                    >
                                        Submit for review
                                    </Button>
                                </Form.Item>
                            </Form>
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={10}>
                    <div className="flex flex-col gap-4">
                        <Card title="Judging rubric">
                            <div className="flex flex-col gap-3">
                                {RUBRIC.map((r) => (
                                    <div key={r.label}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{r.label}</span>
                                            <span className="text-gray-500">{r.weight}%</span>
                                        </div>
                                        <Progress
                                            percent={r.weight}
                                            showInfo={false}
                                            strokeColor={r.color}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Alert
                            type="info"
                            className="bg-[#f1f7f3] border-[#81aa5c]"
                            showIcon
                            styles={{
                                icon: { color: "#668A44" },
                                actions: { color: "#668A44" },
                            }}
                            message="N500,000 Creative Impact Prize"
                            description="Awarded once, at the end of the entire Challenge, to the top institution/team in the Community & Social Media Engagement Track."
                        />
                    </div>
                </Col>
            </Row>
        </div>
    )
}
