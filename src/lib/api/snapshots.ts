import { apiClient } from "./client"

export interface LeaderboardSnapshot {
    id: number
    phase_id: number
    snapshot_type: "provisional" | "final"
    note: string | null
    payload: {
        individual: unknown[]
        institution: unknown[]
    }
    created_by: number
    created_at: string
}

export async function fetchSnapshots(phaseId?: number): Promise<LeaderboardSnapshot[]> {
    const { data } = await apiClient.get<{ data: LeaderboardSnapshot[] }>("/admin/leaderboard-snapshots", {
        params: { phase_id: phaseId },
    })
    return data.data
}

export async function createSnapshot(payload: {
    phase_id: number
    snapshot_type: "provisional" | "final"
    note?: string
}): Promise<LeaderboardSnapshot> {
    const { data } = await apiClient.post<{ data: LeaderboardSnapshot }>("/admin/leaderboard-snapshots", payload)
    return data.data
}
