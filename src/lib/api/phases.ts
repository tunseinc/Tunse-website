import { apiClient } from "./client"

export type PhaseStatus = "draft" | "open" | "frozen" | "closed"

export interface Phase {
    id: number
    name: string
    number: number
    starts_at: string
    ends_at: string
    status: PhaseStatus
    prize_text: string | null
    rules_version: string
}

export async function fetchPhases(): Promise<Phase[]> {
    const { data } = await apiClient.get<{ data: Phase[] }>("/phases")
    return data.data
}

export async function createPhase(payload: {
    name: string
    number: number
    starts_at: string
    ends_at: string
    prize_text?: string
    rules_version?: string
}): Promise<Phase> {
    const { data } = await apiClient.post<{ data: Phase }>("/admin/phases", payload)
    return data.data
}

export async function updatePhase(id: number, payload: Partial<Phase>): Promise<Phase> {
    const { data } = await apiClient.patch<{ data: Phase }>(`/admin/phases/${id}`, payload)
    return data.data
}

export async function transitionPhase(id: number, status: PhaseStatus): Promise<Phase> {
    const { data } = await apiClient.post<{ data: Phase }>(`/admin/phases/${id}/transition`, { status })
    return data.data
}
