import { apiClient } from "./client"

export interface ClaimType {
    id: number
    phase_id: number
    code: string
    label: string
    base_points: number | null
    active: boolean
    validation_rule_text: string | null
}

export async function fetchClaimTypesForPhase(phaseId: number): Promise<ClaimType[]> {
    const { data } = await apiClient.get<{ data: ClaimType[] }>(`/phases/${phaseId}/claim-types`)
    return data.data
}

export async function createClaimType(payload: {
    phase_id: number
    code: string
    label: string
    base_points?: number | null
    validation_rule_text?: string
}): Promise<ClaimType> {
    const { data } = await apiClient.post<{ data: ClaimType }>("/admin/claim-types", payload)
    return data.data
}

export async function updateClaimType(
    id: number,
    payload: Partial<Pick<ClaimType, "label" | "base_points" | "active" | "validation_rule_text">>,
): Promise<ClaimType> {
    const { data } = await apiClient.patch<{ data: ClaimType }>(`/admin/claim-types/${id}`, payload)
    return data.data
}
