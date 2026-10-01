import type { ReactNode } from "react"
import { Navigate } from "react-router"
import { useAuthStore } from "../stores/authStore"

export default function RequireVerifiedEmail({ children }: { children: ReactNode }) {
    const verified = useAuthStore((s) => s.user?.email_verified)

    if (!verified) {
        return <Navigate to="/challenge/verify-email-notice" replace />
    }

    return children
}
