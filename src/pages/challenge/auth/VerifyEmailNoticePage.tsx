import { Alert, Button, Card } from "antd"
import { useState } from "react"
import { Navigate } from "react-router"
import useDocumentHead from "../../../hooks/use-document-head"
import { useResendVerification } from "../../../features/challenge/auth/useAuth"
import { redirectPathForRole } from "../../../lib/redirectPathForRole"
import { useAuthStore } from "../../../stores/authStore"

export default function VerifyEmailNoticePage() {
    useDocumentHead({ title: "Verify Your Email — Tunse Challenge" })
    const user = useAuthStore((s) => s.user)
    const resendMutation = useResendVerification()
    const [sent, setSent] = useState(false)

    if (user?.email_verified) {
        return <Navigate to={redirectPathForRole(user.role)} replace />
    }

    return (
        <div className="max-w-md mx-auto px-4 py-16">
            <Card className="shadow-sm text-center">
                <h1 className="text-xl font-semibold mb-1">Check your inbox</h1>
                <p className="text-gray-500 mb-4 text-sm">
                    {user ? (
                        <>
                            We sent a verification link to <strong>{user.email}</strong>. Confirm it to
                            unlock your Challenge dashboard.
                        </>
                    ) : (
                        <>Please verify your email, or log in to resend the link.</>
                    )}
                </p>

                {sent && (
                    <Alert
                        type="success"
                        showIcon
                        className="mb-4 text-left"
                        message="Verification link sent — check your inbox."
                    />
                )}
                {resendMutation.isError && (
                    <Alert
                        type="error"
                        showIcon
                        className="mb-4 text-left"
                        message="Couldn't resend the link"
                        description="Please try again in a moment."
                    />
                )}

                {user && (
                    <Button
                        type="primary"
                        shape="round"
                        size="large"
                        loading={resendMutation.isPending}
                        onClick={() => resendMutation.mutate(undefined, { onSuccess: () => setSent(true) })}
                    >
                        Resend verification email
                    </Button>
                )}
            </Card>
        </div>
    )
}
