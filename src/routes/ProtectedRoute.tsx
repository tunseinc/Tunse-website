import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router"
import { useAuthStore } from "../stores/authStore"

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const token = useAuthStore((s) => s.token)
    const location = useLocation()

    if (!token) {
        return <Navigate to="/challenge/login" replace state={{ from: location }} />
    }

    return children
}
