import { create } from "zustand"

interface AdminClaimsFilters {
    phaseId?: number
    status?: string
    institutionId?: number
    search?: string
    sort?: "risk" | "recent"
}

interface UiState {
    adminClaimsFilters: AdminClaimsFilters
    setAdminClaimsFilters: (filters: AdminClaimsFilters) => void
}

export const useUiStore = create<UiState>((set) => ({
    adminClaimsFilters: { sort: "risk" },
    setAdminClaimsFilters: (filters) => set({ adminClaimsFilters: filters }),
}))
