import { describe, expect, it, vi, beforeEach } from "vitest"
import userEvent from "@testing-library/user-event"
import { Route, Routes } from "react-router"
import ChallengeLoginPage from "./ChallengeLoginPage"
import { renderWithProviders } from "../../../test/testUtils"
import * as authApi from "../../../lib/api/auth"
import { useAuthStore } from "../../../stores/authStore"

function App() {
    return (
        <Routes>
            <Route path="/challenge/login" element={<ChallengeLoginPage />} />
            <Route path="/challenge/student/dashboard" element={<div>Student Dashboard</div>} />
            <Route path="/challenge/admin/dashboard" element={<div>Admin Dashboard</div>} />
        </Routes>
    )
}

describe("ChallengeLoginPage", () => {
    beforeEach(() => {
        useAuthStore.setState({ token: null, user: null })
        vi.restoreAllMocks()
    })

    it("logs in a student and redirects to the student dashboard", async () => {
        vi.spyOn(authApi, "login").mockResolvedValue({
            token: "tok-1",
            user: { id: 1, name: "Jane", email: "jane@example.com", role: "student" },
        })
        const user = userEvent.setup()

        const { getByLabelText, getByRole, findByText } = renderWithProviders(<App />, { route: "/challenge/login" })

        await user.type(getByLabelText("Email"), "jane@example.com")
        await user.type(getByLabelText("Password"), "password123")
        await user.click(getByRole("button", { name: "Log in" }))

        expect(await findByText("Student Dashboard")).toBeInTheDocument()
        expect(useAuthStore.getState().token).toBe("tok-1")
    })

    it("logs in staff and redirects to the admin dashboard", async () => {
        vi.spyOn(authApi, "login").mockResolvedValue({
            token: "tok-2",
            user: { id: 2, name: "Admin", email: "admin@example.com", role: "admin" },
        })
        const user = userEvent.setup()

        const { getByLabelText, getByRole, findByText } = renderWithProviders(<App />, { route: "/challenge/login" })

        await user.type(getByLabelText("Email"), "admin@example.com")
        await user.type(getByLabelText("Password"), "password")
        await user.click(getByRole("button", { name: "Log in" }))

        expect(await findByText("Admin Dashboard")).toBeInTheDocument()
    })

    it("shows an error alert when login fails", async () => {
        vi.spyOn(authApi, "login").mockRejectedValue(new Error("Invalid credentials"))
        const user = userEvent.setup()

        const { getByLabelText, getByRole, findByText } = renderWithProviders(<App />, { route: "/challenge/login" })

        await user.type(getByLabelText("Email"), "jane@example.com")
        await user.type(getByLabelText("Password"), "wrong")
        await user.click(getByRole("button", { name: "Log in" }))

        expect(await findByText("Login failed")).toBeInTheDocument()
        expect(useAuthStore.getState().token).toBeNull()
    })
})
