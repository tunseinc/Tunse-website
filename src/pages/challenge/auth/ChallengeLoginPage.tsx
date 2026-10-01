import { Alert, Button, Card, Form, Input } from "antd"
import { Link, useNavigate } from "react-router"
import useDocumentHead from "../../../hooks/use-document-head"
import { useLogin } from "../../../features/challenge/auth/useAuth"
import { redirectPathForRole } from "../../../lib/redirectPathForRole"

export default function ChallengeLoginPage() {
    useDocumentHead({ title: "Log In — Tunse Challenge" })
    const navigate = useNavigate()
    const loginMutation = useLogin()

    const handleSubmit = (values: { email: string; password: string }) => {
        loginMutation.mutate(values, {
            onSuccess: (data) => navigate(redirectPathForRole(data.user.role)),
        })
    }

    return (
        <div className="max-w-md mx-auto px-4 py-16">
            <Card className="shadow-sm">
                <h1 className="text-xl font-semibold mb-1">Log in to the Challenge</h1>
                <p className="text-gray-500 mb-4 text-sm">
                    Use the email and password you registered your Challenge profile with.
                </p>
                {loginMutation.isError && (
                    <Alert
                        type="error"
                        showIcon
                        className="mb-4"
                        message="Login failed"
                        description="Check your email and password and try again."
                    />
                )}
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
                        <Input size="large" placeholder="you@example.edu.ng" />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                        <Input.Password size="large" placeholder="Your password" />
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        shape="round"
                        size="large"
                        block
                        loading={loginMutation.isPending}
                    >
                        Log in
                    </Button>
                </Form>
                <p className="text-center text-sm text-gray-500 mt-4">
                    New to the Challenge? <Link to="/challenge/register">Register here</Link>
                </p>
            </Card>
        </div>
    )
}
