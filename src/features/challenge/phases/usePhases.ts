import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createPhase, fetchPhases, transitionPhase, updatePhase } from "../../../lib/api/phases"
import type { Phase, PhaseStatus } from "../../../lib/api/phases"
import { queryKeys } from "../../../lib/queryKeys"

export function usePhases() {
    return useQuery({
        queryKey: queryKeys.phases(),
        queryFn: fetchPhases,
        staleTime: 60_000,
    })
}

export function useActivePhase() {
    const { data: phases, ...rest } = usePhases()
    const activePhase = phases?.find((p) => p.status === "open" && p.number > 0)
    return { ...rest, data: activePhase, phases }
}

export function useCreatePhase() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: Parameters<typeof createPhase>[0]) => createPhase(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.phases() }),
    })
}

export function useUpdatePhase() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<Phase> }) => updatePhase(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.phases() }),
    })
}

export function useTransitionPhase() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: PhaseStatus }) => transitionPhase(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.phases() }),
    })
}
