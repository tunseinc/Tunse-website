import { Button, Result, Spin } from "antd"
import { useEffect, useRef } from "react"
import { Link, useParams, useSearchParams } from "react-router"
import useDocumentHead from "../../../hooks/use-document-head"
import { useVerifyEmail } from "../../../features/challenge/auth/useAuth"
import { fetchCurrentUser } from "../../../lib/api/auth"
import { redirectPathForRole } from "../../../lib/redirectPathForRole"
import { useAuthStore } from "../../../stores/authStore"

export default function VerifyEmailLandingPage() {
    useDocumentHead({ title: "Verify Your Email — Tunse Challenge" })
    const { id, hash } = useParams<{ id: string; hash: string }>()
    const [searchParams] = useSearchParams()
    const verifyMutation = useVerifyEmail()
    const fired = useRef(false)
    const token = useAuthStore((s) => s.token)
    const role = useAuthStore((s) => s.user?.role)
    const login = useAuthStore((s) => s.login)

    useEffect(() => {
        if (fired.current || !id || !hash) return
        fired.current = true

        const expires = searchParams.get("expires") ?? ""
        const signature = searchParams.get("signature") ?? ""

        verifyMutation.mutate(
            { id, hash, expires, signature },
            {
                onSuccess: async () => {
                    if (!token) return
                    const { user } = await fetchCurrentUser()
                    login(token, user)
                },
            },
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, hash])

    if (verifyMutation.isPending || verifyMutation.isIdle) {
        return (
            <div className="max-w-md mx-auto px-4 py-24 text-center">
                <Spin size="large" />
                <p className="text-gray-500 mt-4">Verifying your email…</p>
            </div>
        )
    }

    if (verifyMutation.isError) {
        return (
            <div className="max-w-lg mx-auto px-4 py-16">
                <Result
                    status="error"
                    title="This verification link isn't valid"
                    subTitle="It may have expired or already been used. You can request a new one from the verification page."
                    extra={
                        <Link to="/challenge/verify-email-notice">
                            <Button type="primary" shape="round" size="large">
                                Request a new link
                            </Button>
                        </Link>
                    }
                />
            </div>
        )
    }

    return (
        <div className="max-w-lg mx-auto px-4 py-16">
            <Result
                status="success"
                title="Email verified"
                subTitle={
                    token
                        ? "You're all set — head to your dashboard to continue."
                        : "You're all set — log in on this device to continue."
                }
                extra={
                    <Link to={token ? redirectPathForRole(role ?? "student") : "/challenge/login"}>
                        <Button type="primary" shape="round" size="large">
                            {token ? "Go to my dashboard" : "Log in"}
                        </Button>
                    </Link>
                }
            />
        </div>
    )
}
