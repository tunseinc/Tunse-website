import { apiClient } from "./client"

export interface DashboardKpis {
    participants: number
    institutions: { active: number; inactive: number }
    claims_by_type: Array<{ claim_type: string | null; total: number }>
    claims_by_status: Record<string, number>
    rejection_rate: number
    verification_rate: number
    state_coverage: Record<string, number>
    lga_coverage: Record<string, number>
    category_coverage: Record<string, number>
    phases_by_status: Record<string, number>
    pending_audit_count: number
}

export async function fetchDashboard(): Promise<DashboardKpis> {
    const { data } = await apiClient.get<{ data: DashboardKpis }>("/admin/dashboard")
    return data.data
}
