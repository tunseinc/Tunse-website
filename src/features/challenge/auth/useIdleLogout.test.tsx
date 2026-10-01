import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { renderHook } from "@testing-library/react"
import { QueryClientProvider } from "@tanstack/react-query"
import { useIdleLogout } from "./useIdleLogout"
import { useAuthStore } from "../../../stores/authStore"
import { createTestQueryClient } from "../../../test/testUtils"
import * as authApi from "../../../lib/api/auth"
import type { ReactNode } from "react"

function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={createTestQueryClient()}>{children}</QueryClientProvider>
}

describe("useIdleLogout", () => {
    beforeEach(() => {
        vi.useFakeTimers()
        useAuthStore.setState({ token: null, user: null })
        vi.spyOn(authApi, "logout").mockResolvedValue(undefined)
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.restoreAllMocks()
    })

    it("does nothing when there is no authenticated user", async () => {
        renderHook(() => useIdleLogout(1000), { wrapper: Wrapper })

        await vi.advanceTimersByTimeAsync(5000)

        expect(useAuthStore.getState().token).toBeNull()
    })

    it("logs the user out after the timeout with no activity", async () => {
        useAuthStore.setState({ token: "tok", user: { id: 1, name: "A", email: "a@example.com", role: "student" } })
        renderHook(() => useIdleLogout(1000), { wrapper: Wrapper })

        await vi.advanceTimersByTimeAsync(1001)

        expect(useAuthStore.getState().token).toBeNull()
    })

    it("resets the timer on activity so it does not log out early", async () => {
        useAuthStore.setState({ token: "tok", user: { id: 1, name: "A", email: "a@example.com", role: "student" } })
        renderHook(() => useIdleLogout(1000), { wrapper: Wrapper })

        await vi.advanceTimersByTimeAsync(700)
        window.dispatchEvent(new Event("mousemove"))
        await vi.advanceTimersByTimeAsync(700)

        expect(useAuthStore.getState().token).toBe("tok")

        await vi.advanceTimersByTimeAsync(400)
        expect(useAuthStore.getState().token).toBeNull()
    })
})
