import { apiClient } from "./client"

export interface ScoreAdjustment {
    id: number
    targetable_type: "user" | "institution"
    targetable_id: number
    phase_id: number
    points: number
    reason: string
    admin_id: number
    created_at: string
}

export async function fetchScoreAdjustments(
    filters: { phase_id?: number; target_type?: string; target_id?: number } = {},
): Promise<ScoreAdjustment[]> {
    const { data } = await apiClient.get<{ data: ScoreAdjustment[] }>("/admin/score-adjustments", { params: filters })
    return data.data
}

export interface CreateScoreAdjustmentPayload {
    targetable_type: "user" | "institution"
    targetable_id: number
    phase_id: number
    points: number
    reason: string
}

export async function createScoreAdjustment(payload: CreateScoreAdjustmentPayload): Promise<ScoreAdjustment> {
    const { data } = await apiClient.post<{ data: ScoreAdjustment }>("/admin/score-adjustments", payload)
    return data.data
}
