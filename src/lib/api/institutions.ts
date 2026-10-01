import { apiClient } from "./client"

export interface Institution {
    id: number
    name: string
    short_code: string
    state: string
    active: boolean
    coordinator_name?: string | null
    participant_count?: number
    created_at?: string
}

export async function fetchInstitutions(staff: boolean): Promise<Institution[]> {
    const { data } = await apiClient.get<{ data: Institution[] }>(staff ? "/admin/institutions" : "/institutions")
    return data.data
}

export async function createInstitution(payload: {
    name: string
    short_code: string
    state: string
    coordinator_name?: string
}): Promise<Institution> {
    const { data } = await apiClient.post<{ data: Institution }>("/admin/institutions", payload)
    return data.data
}

export async function updateInstitution(
    id: number,
    payload: Partial<Pick<Institution, "name" | "short_code" | "state" | "coordinator_name" | "active">>,
): Promise<Institution> {
    const { data } = await apiClient.patch<{ data: Institution }>(`/admin/institutions/${id}`, payload)
    return data.data
}
