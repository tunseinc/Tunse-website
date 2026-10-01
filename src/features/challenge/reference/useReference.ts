import { useQuery } from "@tanstack/react-query"
import { fetchCategories, fetchStates } from "../../../lib/api/reference"
import { queryKeys } from "../../../lib/queryKeys"

export function useStates() {
    return useQuery({
        queryKey: queryKeys.states(),
        queryFn: fetchStates,
        staleTime: 60 * 60_000,
    })
}

export function useCategories() {
    return useQuery({
        queryKey: queryKeys.categories(),
        queryFn: fetchCategories,
        staleTime: 60 * 60_000,
    })
}
