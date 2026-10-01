import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    fetchAdminClaims,
    fetchClaim,
    fetchMyClaims,
    reviewClaim,
    submitClaim,
    updateClaim,
} from "../../../lib/api/claims"
import type {
    AdminClaimsFilters,
    ReviewClaimPayload,
    SubmitClaimPayload,
    UpdateClaimPayload,
} from "../../../lib/api/claims"
import { queryKeys } from "../../../lib/queryKeys"

export function useMyClaims(filters: { phase_id?: number; status?: string } = {}) {
    return useQuery({
        queryKey: queryKeys.claims.list(filters),
        queryFn: () => fetchMyClaims(filters),
        staleTime: 15_000,
    })
}

export function useClaim(id: number | undefined) {
    return useQuery({
        queryKey: queryKeys.claims.detail(id ?? 0),
        queryFn: () => fetchClaim(id as number),
        enabled: !!id,
    })
}

export function useSubmitClaim() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: SubmitClaimPayload) => submitClaim(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["claims"] })
            queryClient.invalidateQueries({ queryKey: ["leaderboards"] })
        },
    })
}

export function useUpdateClaim() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateClaimPayload }) => updateClaim(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["claims"] })
            queryClient.invalidateQueries({ queryKey: ["leaderboards"] })
        },
    })
}

export function useAdminClaims(filters: AdminClaimsFilters = {}) {
    return useQuery({
        queryKey: queryKeys.claims.adminList(filters),
        queryFn: () => fetchAdminClaims(filters),
        staleTime: 10_000,
    })
}

export function useReviewClaim() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: ReviewClaimPayload }) => reviewClaim(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["claims"] })
            queryClient.invalidateQueries({ queryKey: ["leaderboards"] })
        },
    })
}
