import { useQuery } from "@tanstack/react-query"
import {
    fetchCumulativeLeaderboard,
    fetchIndividualLeaderboard,
    fetchInstitutionLeaderboard,
} from "../../../lib/api/leaderboards"
import type { LeaderboardType } from "../../../lib/api/leaderboards"
import { queryKeys } from "../../../lib/queryKeys"

export function useIndividualLeaderboard(
    phaseId: number | undefined,
    institutionId?: number,
    type: LeaderboardType = "provisional",
) {
    return useQuery({
        queryKey: queryKeys.leaderboards.individual(phaseId ?? 0, institutionId, type),
        queryFn: () => fetchIndividualLeaderboard(phaseId as number, institutionId, type),
        enabled: !!phaseId,
        staleTime: 15_000,
    })
}

export function useInstitutionLeaderboard(phaseId: number | undefined, type: LeaderboardType = "provisional") {
    return useQuery({
        queryKey: queryKeys.leaderboards.institution(phaseId ?? 0, type),
        queryFn: () => fetchInstitutionLeaderboard(phaseId as number, type),
        enabled: !!phaseId,
        staleTime: 15_000,
    })
}

export function useCumulativeLeaderboard() {
    return useQuery({
        queryKey: queryKeys.leaderboards.cumulative(),
        queryFn: fetchCumulativeLeaderboard,
        staleTime: 30_000,
    })
}
