import { useQuery } from "@tanstack/react-query"
import { fetchDashboard } from "../../../lib/api/dashboard"
import { queryKeys } from "../../../lib/queryKeys"

export function useDashboard() {
    return useQuery({
        queryKey: queryKeys.dashboard(),
        queryFn: fetchDashboard,
        staleTime: 30_000,
    })
}
