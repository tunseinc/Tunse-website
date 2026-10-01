import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClaimType, fetchClaimTypesForPhase, updateClaimType } from "../../../lib/api/claimTypes"
import type { ClaimType } from "../../../lib/api/claimTypes"
import { queryKeys } from "../../../lib/queryKeys"
import { usePhases } from "../phases/usePhases"

export function useClaimTypesForPhase(phaseId: number | undefined) {
    return useQuery({
        queryKey: queryKeys.claimTypes(phaseId ?? 0),
        queryFn: () => fetchClaimTypesForPhase(phaseId as number),
        enabled: !!phaseId,
        staleTime: 5 * 60_000,
    })
}

/**
 * Fetches claim types across every phase, for pages like the Rules & FAQ
 * that need the full scoring table rather than one phase at a time.
 */
export function useAllClaimTypes() {
    const { data: phases = [] } = usePhases()

    const results = useQueries({
        queries: phases.map((phase) => ({
            queryKey: queryKeys.claimTypes(phase.id),
            queryFn: () => fetchClaimTypesForPhase(phase.id),
            enabled: phases.length > 0,
            staleTime: 5 * 60_000,
        })),
    })

    return {
        data: results.flatMap((r) => r.data ?? []),
        isLoading: results.some((r) => r.isLoading),
    }
}

export function useCreateClaimType() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: Parameters<typeof createClaimType>[0]) => createClaimType(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["claimTypes"] }),
    })
}

export function useUpdateClaimType() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<ClaimType> }) => updateClaimType(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["claimTypes"] }),
    })
}
