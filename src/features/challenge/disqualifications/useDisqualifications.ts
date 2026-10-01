import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    createDisqualification,
    fetchDisqualifications,
    reinstateDisqualification,
} from "../../../lib/api/disqualifications"
import type { CreateDisqualificationPayload } from "../../../lib/api/disqualifications"
import { queryKeys } from "../../../lib/queryKeys"

export function useDisqualifications(filters: { active?: boolean; targetable_type?: string } = {}) {
    return useQuery({
        queryKey: queryKeys.disqualifications(filters),
        queryFn: () => fetchDisqualifications(filters),
        staleTime: 15_000,
    })
}

export function useCreateDisqualification() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: CreateDisqualificationPayload) => createDisqualification(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["disqualifications"] })
            queryClient.invalidateQueries({ queryKey: ["leaderboards"] })
        },
    })
}

export function useReinstateDisqualification() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => reinstateDisqualification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["disqualifications"] })
            queryClient.invalidateQueries({ queryKey: ["leaderboards"] })
        },
    })
}
