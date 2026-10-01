import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createInstitution, fetchInstitutions, updateInstitution } from "../../../lib/api/institutions"
import type { Institution } from "../../../lib/api/institutions"
import { queryKeys } from "../../../lib/queryKeys"
import { useAuthStore } from "../../../stores/authStore"

export function useInstitutions() {
    const isStaff = useAuthStore((s) => s.isStaff())

    return useQuery({
        queryKey: queryKeys.institutions(isStaff),
        queryFn: () => fetchInstitutions(isStaff),
        staleTime: 5 * 60_000,
    })
}

export function useCreateInstitution() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: Parameters<typeof createInstitution>[0]) => createInstitution(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["institutions"] }),
    })
}

export function useUpdateInstitution() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<Institution> }) => updateInstitution(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["institutions"] }),
    })
}
