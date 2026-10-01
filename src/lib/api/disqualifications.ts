import { apiClient } from "./client"

export interface Disqualification {
    id: number
    targetable_type: "user" | "institution"
    targetable_id: number
    phase_id: number
    reason: string
    admin_id: number
    active: boolean
    created_at: string
}

export async function fetchDisqualifications(filters: { active?: boolean; targetable_type?: string } = {}): Promise<
    Disqualification[]
> {
    const { data } = await apiClient.get<{ data: Disqualification[] }>("/admin/disqualifications", { params: filters })
    return data.data
}

export interface CreateDisqualificationPayload {
    targetable_type: "user" | "institution"
    targetable_id: number
    phase_id: number
    reason: string
}

export async function createDisqualification(payload: CreateDisqualificationPayload): Promise<Disqualification> {
    const { data } = await apiClient.post<{ data: Disqualification }>("/admin/disqualifications", payload)
    return data.data
}

export async function reinstateDisqualification(id: number): Promise<Disqualification> {
    const { data } = await apiClient.post<{ data: Disqualification }>(`/admin/disqualifications/${id}/reinstate`)
    return data.data
}
