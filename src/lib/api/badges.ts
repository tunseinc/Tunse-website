import { apiClient } from "./client"

export interface Badge {
    id: number
    code: string
    name: string
    criteria_text: string | null
    active: boolean
}

export interface UserBadge {
    id: number
    user_id: number
    badge: Badge
    phase_id: number
    awarded_at: string
}

export async function fetchBadges(): Promise<Badge[]> {
    const { data } = await apiClient.get<{ data: Badge[] }>("/badges")
    return data.data
}

export async function fetchMyBadges(): Promise<UserBadge[]> {
    const { data } = await apiClient.get<{ data: UserBadge[] }>("/me/badges")
    return data.data
}

export async function createBadge(payload: { code: string; name: string; criteria_text?: string }): Promise<Badge> {
    const { data } = await apiClient.post<{ data: Badge }>("/admin/badges", payload)
    return data.data
}

export async function awardBadge(payload: { user_id: number; badge_id: number; phase_id: number }): Promise<UserBadge> {
    const { data } = await apiClient.post<{ data: UserBadge }>("/admin/user-badges", payload)
    return data.data
}
