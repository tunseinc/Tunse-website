import { apiClient } from "./client"
import type { ClaimType } from "./claimTypes"
import type { AuthUser } from "../../stores/authStore"

export type ClaimStatus = "submitted" | "verified" | "rejected" | "flagged" | "correction_requested"

export interface Audit {
    id: number
    claim_id: number
    auditor_name?: string
    outcome: "verified" | "rejected" | "flagged" | "correction"
    backend_lookup_key: string | null
    audit_notes: string | null
    audited_at: string
}

export interface Claim {
    id: number
    user_id: number
    student_name?: string
    student_email?: string
    student_profile?: NonNullable<AuthUser["student_profile"]>
    institution_id: number
    institution_name?: string
    phase_id: number
    claim_type: ClaimType
    recruit_name: string
    recruit_phone: string
    state: string
    lga: string
    category: string | null
    date_recruited: string
    has_photo: boolean
    notes: string | null
    declaration_at: string
    status: ClaimStatus
    provisional_points: number
    audited_points: number | null
    tworker_phone: string | null
    transaction_reference: string | null
    approx_value: string | null
    rating: number | null
    created_at: string
    audits?: Audit[]
    duplicate_warnings?: Array<{ claim_id: number; student_name?: string }>
    risk_reasons?: string[]
}

export interface SubmitClaimPayload {
    claim_type_id: number
    recruit_name: string
    recruit_phone: string
    state: string
    lga: string
    category?: string
    date_recruited: string
    photo?: File
    notes?: string
    declaration: boolean
    tworker_phone?: string
    transaction_reference?: string
    approx_value?: number
    rating?: number
}

export interface PaginatedResponse<T> {
    data: T[]
    meta?: { current_page: number; last_page: number; total: number }
}

export async function fetchMyClaims(filters: { phase_id?: number; status?: string } = {}): Promise<Claim[]> {
    const { data } = await apiClient.get<PaginatedResponse<Claim>>("/claims", { params: filters })
    return data.data
}

export async function fetchClaim(id: number): Promise<Claim> {
    const { data } = await apiClient.get<{ data: Claim }>(`/claims/${id}`)
    return data.data
}

export async function submitClaim(payload: SubmitClaimPayload): Promise<Claim> {
    const formData = new FormData()
    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined) return
        if (value instanceof File) {
            formData.append(key, value)
        } else {
            formData.append(key, String(value))
        }
    })

    const { data } = await apiClient.post<{ data: Claim }>("/claims", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    return data.data
}

export type UpdateClaimPayload = Partial<Omit<SubmitClaimPayload, "declaration">>

export async function updateClaim(id: number, payload: UpdateClaimPayload): Promise<Claim> {
    const formData = new FormData()
    formData.append("_method", "PATCH")
    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined) return
        if (value instanceof File) {
            formData.append(key, value)
        } else {
            formData.append(key, String(value))
        }
    })

    const { data } = await apiClient.post<{ data: Claim }>(`/claims/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    return data.data
}

export interface AdminClaimsFilters {
    phase_id?: number
    status?: string
    institution_id?: number
    search?: string
    risk_reason?: string
    sort?: "risk" | "recent"
    page?: number
}

export async function fetchAdminClaims(filters: AdminClaimsFilters = {}): Promise<PaginatedResponse<Claim>> {
    const { data } = await apiClient.get<PaginatedResponse<Claim>>("/admin/claims", { params: filters })
    return data
}

export interface ReviewClaimPayload {
    outcome: "verified" | "rejected" | "flagged" | "correction"
    audit_notes?: string
    backend_lookup_key?: string
}

export async function reviewClaim(id: number, payload: ReviewClaimPayload): Promise<Claim> {
    const { data } = await apiClient.post<{ data: Claim }>(`/admin/claims/${id}/review`, payload)
    return data.data
}
