import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { awardBadge, createBadge, fetchBadges, fetchMyBadges } from "../../../lib/api/badges"
import { queryKeys } from "../../../lib/queryKeys"

export function useBadges() {
    return useQuery({
        queryKey: queryKeys.badges(),
        queryFn: fetchBadges,
        staleTime: 5 * 60_000,
    })
}

export function useMyBadges() {
    return useQuery({
        queryKey: queryKeys.myBadges(),
        queryFn: fetchMyBadges,
        staleTime: 60_000,
    })
}

export function useCreateBadge() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: Parameters<typeof createBadge>[0]) => createBadge(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.badges() }),
    })
}

export function useAwardBadge() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: Parameters<typeof awardBadge>[0]) => awardBadge(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["badges"] }),
    })
}
