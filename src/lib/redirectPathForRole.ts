import type { AuthUser } from "../stores/authStore"

export function redirectPathForRole(role: AuthUser["role"]): string {
    return role === "student" ? "/challenge/student/dashboard" : "/challenge/admin/dashboard"
}
