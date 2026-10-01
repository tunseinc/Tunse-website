// Presentation-only types that remain in use after the backend integration:
// PhaseStatus/ClaimStatus/StaffRole are simple string unions shared by badge/tag
// components, and CategoryDef backs the static service-category icon catalog
// (categories.ts) kept client-side as a fast, icon-bearing reference list.

export type PhaseStatus = "draft" | "open" | "frozen" | "closed"
export type ClaimStatus =
    | "submitted"
    | "verified"
    | "rejected"
    | "flagged"
    | "correction_requested"
export type StaffRole = "admin" | "auditor" | "super_admin"

export interface CategoryDef {
    id: string
    label: string
    bgColor: string
}
