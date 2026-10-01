import { apiClient } from "./client"

export interface CommunitySubmission {
    id: number
    user_id: number
    student_name?: string
    institution_id: number
    platform: "x" | "facebook" | "youtube"
    post_url: string
    community_type: "verifiers" | "tworkers" | "customers" | "vendors" | "students"
    consent_confirmed: boolean
    title: string
    description: string
    score_note: string | null
    created_at: string
}

export interface SubmitCommunitySubmissionPayload {
    platform: "x" | "facebook" | "youtube"
    post_url: string
    community_type: "verifiers" | "tworkers" | "customers" | "vendors" | "students"
    consent_confirmed: boolean
    title: string
    description: string
}

export async function fetchCommunitySubmissions(staff: boolean): Promise<CommunitySubmission[]> {
    const { data } = await apiClient.get<{ data: CommunitySubmission[] }>(
        staff ? "/admin/community-submissions" : "/community-submissions",
    )
    return data.data
}

export async function submitCommunitySubmission(
    payload: SubmitCommunitySubmissionPayload,
): Promise<CommunitySubmission> {
    const { data } = await apiClient.post<{ data: CommunitySubmission }>("/community-submissions", payload)
    return data.data
}

export async function updateCommunitySubmissionScoreNote(id: number, scoreNote: string): Promise<CommunitySubmission> {
    const { data } = await apiClient.patch<{ data: CommunitySubmission }>(`/admin/community-submissions/${id}/score-note`, {
        score_note: scoreNote,
    })
    return data.data
}
