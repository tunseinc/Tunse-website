import type { ReactNode } from "react"
import { Navigate } from "react-router"
import { useAuthStore, type UserRole } from "../stores/authStore"

export default function RoleGuard({ allow, children }: { allow: UserRole[]; children: ReactNode }) {
    const role = useAuthStore((s) => s.user?.role)

    if (!role || !allow.includes(role)) {
        const fallback = role === "student" ? "/challenge/student/dashboard" : "/challenge/login"
        return <Navigate to={fallback} replace />
    }

    return children
}
