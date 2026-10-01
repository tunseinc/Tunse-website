import { describe, expect, it, beforeEach } from "vitest"
import { Route, Routes } from "react-router"
import ProtectedRoute from "./ProtectedRoute"
import { useAuthStore } from "../stores/authStore"
import { renderWithProviders } from "../test/testUtils"

function Protected() {
    return (
        <Routes>
            <Route
                path="/student"
                element={
                    <ProtectedRoute>
                        <div>Student Dashboard</div>
                    </ProtectedRoute>
                }
            />
            <Route path="/challenge/login" element={<div>Login Page</div>} />
        </Routes>
    )
}

describe("ProtectedRoute", () => {
    beforeEach(() => {
        useAuthStore.setState({ token: null, user: null })
    })

    it("redirects to login when there is no token", () => {
        const { getByText } = renderWithProviders(<Protected />, { route: "/student" })

        expect(getByText("Login Page")).toBeInTheDocument()
    })

    it("renders the protected content when a token is present", () => {
        useAuthStore.setState({ token: "abc", user: { id: 1, name: "A", email: "a@example.com", role: "student" } })

        const { getByText } = renderWithProviders(<Protected />, { route: "/student" })

        expect(getByText("Student Dashboard")).toBeInTheDocument()
    })
})
