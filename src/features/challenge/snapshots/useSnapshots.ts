import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createSnapshot, fetchSnapshots } from "../../../lib/api/snapshots"
import { queryKeys } from "../../../lib/queryKeys"

export function useSnapshots(phaseId?: number) {
    return useQuery({
        queryKey: queryKeys.snapshots(phaseId),
        queryFn: () => fetchSnapshots(phaseId),
        staleTime: 15_000,
    })
}

export function useCreateSnapshot() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: Parameters<typeof createSnapshot>[0]) => createSnapshot(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["snapshots"] })
            queryClient.invalidateQueries({ queryKey: ["leaderboards"] })
        },
    })
}
