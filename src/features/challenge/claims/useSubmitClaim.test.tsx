import { describe, expect, it, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClientProvider } from "@tanstack/react-query"
import { useSubmitClaim } from "./useClaims"
import * as claimsApi from "../../../lib/api/claims"
import { createTestQueryClient } from "../../../test/testUtils"
import type { ReactNode } from "react"

function wrapper(queryClient = createTestQueryClient()) {
    return { queryClient, Wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ) }
}

describe("useSubmitClaim", () => {
    it("invalidates claims and leaderboards queries on success", async () => {
        const fakeClaim = { id: 1, status: "submitted" } as unknown as claimsApi.Claim
        vi.spyOn(claimsApi, "submitClaim").mockResolvedValue(fakeClaim)
        const { queryClient, Wrapper } = wrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

        const { result } = renderHook(() => useSubmitClaim(), { wrapper: Wrapper })

        result.current.mutate({
            claim_type_id: 1,
            recruit_name: "Test",
            recruit_phone: "08012345678",
            state: "Lagos",
            lga: "Ikeja",
            date_recruited: "2026-01-01",
            declaration: true,
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["claims"] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["leaderboards"] })
    })

    it("surfaces a validation error from the server without invalidating queries", async () => {
        const validationError = Object.assign(new Error("Validation failed"), {
            response: { status: 422, data: { errors: { recruit_phone: ["already claimed"] } } },
        })
        vi.spyOn(claimsApi, "submitClaim").mockRejectedValue(validationError)
        const { queryClient, Wrapper } = wrapper()
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

        const { result } = renderHook(() => useSubmitClaim(), { wrapper: Wrapper })

        result.current.mutate({
            claim_type_id: 1,
            recruit_name: "Test",
            recruit_phone: "08012345678",
            state: "Lagos",
            lga: "Ikeja",
            date_recruited: "2026-01-01",
            declaration: true,
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(invalidateSpy).not.toHaveBeenCalled()
    })
})
