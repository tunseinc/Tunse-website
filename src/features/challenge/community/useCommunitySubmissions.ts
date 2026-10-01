import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    fetchCommunitySubmissions,
    submitCommunitySubmission,
    updateCommunitySubmissionScoreNote,
} from "../../../lib/api/communitySubmissions"
import type { SubmitCommunitySubmissionPayload } from "../../../lib/api/communitySubmissions"
import { queryKeys } from "../../../lib/queryKeys"
import { useAuthStore } from "../../../stores/authStore"

export function useCommunitySubmissions() {
    const isStaff = useAuthStore((s) => s.isStaff())

    return useQuery({
        queryKey: queryKeys.communitySubmissions(isStaff),
        queryFn: () => fetchCommunitySubmissions(isStaff),
        staleTime: 15_000,
    })
}

export function useSubmitCommunitySubmission() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: SubmitCommunitySubmissionPayload) => submitCommunitySubmission(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["communitySubmissions"] }),
    })
}

export function useUpdateCommunitySubmissionScoreNote() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, scoreNote }: { id: number; scoreNote: string }) =>
            updateCommunitySubmissionScoreNote(id, scoreNote),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["communitySubmissions"] }),
    })
}
