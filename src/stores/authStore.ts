import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "student" | "admin" | "auditor" | "super_admin"

export interface AuthUser {
    id: number
    name: string
    email: string
    role: UserRole
    student_profile?: {
        id: number
        challenge_id: string | null
        institution_id: number
        institution_name?: string
        phone: string
        state: string
        department: string
        graduation_year: number
        status: "pending" | "approved" | "disqualified"
        approved_at: string | null
    } | null
}

interface AuthState {
    token: string | null
    user: AuthUser | null
    login: (token: string, user: AuthUser) => void
    logout: () => void
    isStaff: () => boolean
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            login: (token, user) => set({ token, user }),
            logout: () => set({ token: null, user: null }),
            isStaff: () => {
                const role = get().user?.role
                return role === "admin" || role === "auditor" || role === "super_admin"
            },
        }),
        { name: "tunse-challenge-auth" },
    ),
)
