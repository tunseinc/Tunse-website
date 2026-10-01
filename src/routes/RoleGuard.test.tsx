import { describe, expect, it, beforeEach } from "vitest"
import { Route, Routes } from "react-router"
import RoleGuard from "./RoleGuard"
import { useAuthStore } from "../stores/authStore"
import { renderWithProviders } from "../test/testUtils"

function Guarded() {
    return (
        <Routes>
            <Route
                path="/admin"
                element={
                    <RoleGuard allow={["admin", "auditor", "super_admin"]}>
                        <div>Admin Dashboard</div>
                    </RoleGuard>
                }
            />
            <Route path="/challenge/student/dashboard" element={<div>Student Dashboard</div>} />
            <Route path="/challenge/login" element={<div>Login Page</div>} />
        </Routes>
    )
}

describe("RoleGuard", () => {
    beforeEach(() => {
        useAuthStore.setState({ token: null, user: null })
    })

    it("renders the guarded content when the user has an allowed role", () => {
        useAuthStore.setState({
            user: { id: 1, name: "A", email: "a@example.com", role: "admin", email_verified: true },
        })

        const { getByText } = renderWithProviders(<Guarded />, { route: "/admin" })

        expect(getByText("Admin Dashboard")).toBeInTheDocument()
    })

    it("redirects a student away from an admin-only route to their own dashboard", () => {
        useAuthStore.setState({
            user: { id: 1, name: "A", email: "a@example.com", role: "student", email_verified: true },
        })

        const { getByText } = renderWithProviders(<Guarded />, { route: "/admin" })

        expect(getByText("Student Dashboard")).toBeInTheDocument()
    })

    it("redirects to login when there is no authenticated user at all", () => {
        const { getByText } = renderWithProviders(<Guarded />, { route: "/admin" })

        expect(getByText("Login Page")).toBeInTheDocument()
    })
})
