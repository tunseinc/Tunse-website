import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createScoreAdjustment, fetchScoreAdjustments } from "../../../lib/api/scoreAdjustments"
import type { CreateScoreAdjustmentPayload } from "../../../lib/api/scoreAdjustments"
import { queryKeys } from "../../../lib/queryKeys"

export function useScoreAdjustments(filters: { phase_id?: number; target_type?: string; target_id?: number } = {}) {
    return useQuery({
        queryKey: queryKeys.scoreAdjustments(filters),
        queryFn: () => fetchScoreAdjustments(filters),
        staleTime: 15_000,
    })
}

export function useCreateScoreAdjustment() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: CreateScoreAdjustmentPayload) => createScoreAdjustment(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scoreAdjustments"] })
            queryClient.invalidateQueries({ queryKey: ["leaderboards"] })
        },
    })
}
