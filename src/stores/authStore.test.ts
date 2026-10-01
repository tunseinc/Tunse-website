import { describe, expect, it, beforeEach } from "vitest"
import { useAuthStore } from "./authStore"

describe("authStore", () => {
    beforeEach(() => {
        useAuthStore.setState({ token: null, user: null })
    })

    it("stores the token and user on login", () => {
        const user = { id: 1, name: "Jane Student", email: "jane@example.com", role: "student" as const }

        useAuthStore.getState().login("token-abc", user)

        expect(useAuthStore.getState().token).toBe("token-abc")
        expect(useAuthStore.getState().user).toEqual(user)
    })

    it("clears the token and user on logout", () => {
        useAuthStore.getState().login("token-abc", { id: 1, name: "Jane", email: "jane@example.com", role: "student" })

        useAuthStore.getState().logout()

        expect(useAuthStore.getState().token).toBeNull()
        expect(useAuthStore.getState().user).toBeNull()
    })

    it("isStaff returns true for admin/auditor/super_admin and false for student", () => {
        useAuthStore.getState().login("t", { id: 1, name: "A", email: "a@example.com", role: "admin" })
        expect(useAuthStore.getState().isStaff()).toBe(true)

        useAuthStore.getState().login("t", { id: 2, name: "B", email: "b@example.com", role: "auditor" })
        expect(useAuthStore.getState().isStaff()).toBe(true)

        useAuthStore.getState().login("t", { id: 3, name: "C", email: "c@example.com", role: "student" })
        expect(useAuthStore.getState().isStaff()).toBe(false)
    })

    it("isStaff returns false when logged out", () => {
        expect(useAuthStore.getState().isStaff()).toBe(false)
    })
})
