import { describe, expect, it, beforeEach, vi } from "vitest"
import type { InternalAxiosRequestConfig } from "axios"
import { apiClient } from "./client"
import { useAuthStore } from "../../stores/authStore"

function fakeConfig(): InternalAxiosRequestConfig {
    return { headers: {} } as InternalAxiosRequestConfig
}

describe("apiClient", () => {
    beforeEach(() => {
        useAuthStore.setState({ token: null, user: null })
    })

    it("attaches a Bearer token header when a token is present", async () => {
        useAuthStore.setState({ token: "test-token-123", user: null })

        const config = await apiClient.interceptors.request.handlers![0]!.fulfilled!(fakeConfig())

        expect(config.headers.Authorization).toBe("Bearer test-token-123")
    })

    it("does not attach an Authorization header when logged out", async () => {
        const config = await apiClient.interceptors.request.handlers![0]!.fulfilled!(fakeConfig())

        expect(config.headers.Authorization).toBeUndefined()
    })

    it("logs out the user when a request receives a 401", async () => {
        useAuthStore.setState({
            token: "stale-token",
            user: { id: 1, name: "A", email: "a@example.com", role: "student", email_verified: true },
        })
        const logoutSpy = vi.spyOn(useAuthStore.getState(), "logout")

        const rejected = apiClient.interceptors.response.handlers![0]!.rejected!
        await expect(rejected({ response: { status: 401 } })).rejects.toBeDefined()

        expect(logoutSpy).toHaveBeenCalled()
    })

    it("does not log out on a non-401 error", async () => {
        useAuthStore.setState({ token: "still-valid", user: null })

        const rejected = apiClient.interceptors.response.handlers![0]!.rejected!
        await expect(rejected({ response: { status: 422 } })).rejects.toBeDefined()

        expect(useAuthStore.getState().token).toBe("still-valid")
    })
})
