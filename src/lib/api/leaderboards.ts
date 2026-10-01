import { apiClient } from "./client"

export interface IndividualLeaderboardRow {
    user_id: number
    full_name: string
    challenge_id: string | null
    institution_id: number
    institution_name: string | null
    provisional_score: number
    audited_score: number
    verified_claim_count: number
    disqualified: boolean
    rank: number
}

export interface InstitutionLeaderboardRow {
    institution_id: number
    institution_name: string
    state: string
    provisional_score: number
    audited_score: number
    verified_participant_count: number
    total_participant_count: number
    disqualified: boolean
    rank: number
}

export interface CumulativeLeaderboardRow {
    user_id: number
    full_name: string
    challenge_id: string | null
    institution_id: number
    institution_name: string | null
    cumulative_provisional_score: number
    cumulative_audited_score: number
    rank: number
}

export type LeaderboardType = "provisional" | "final"

interface LeaderboardResponse<T> {
    data: T[]
    available: boolean
    snapshot_id?: number
}

export async function fetchIndividualLeaderboard(
    phaseId: number,
    institutionId: number | undefined,
    type: LeaderboardType,
): Promise<LeaderboardResponse<IndividualLeaderboardRow>> {
    const { data } = await apiClient.get<LeaderboardResponse<IndividualLeaderboardRow>>("/leaderboards/individual", {
        params: { phase_id: phaseId, institution_id: institutionId, type },
    })
    return data
}

export async function fetchInstitutionLeaderboard(
    phaseId: number,
    type: LeaderboardType,
): Promise<LeaderboardResponse<InstitutionLeaderboardRow>> {
    const { data } = await apiClient.get<LeaderboardResponse<InstitutionLeaderboardRow>>("/leaderboards/institution", {
        params: { phase_id: phaseId, type },
    })
    return data
}

export async function fetchCumulativeLeaderboard(): Promise<CumulativeLeaderboardRow[]> {
    const { data } = await apiClient.get<{ data: CumulativeLeaderboardRow[] }>("/leaderboards/cumulative")
    return data.data
}
