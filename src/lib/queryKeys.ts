export const queryKeys = {
    me: () => ["me"] as const,
    institutions: (staff: boolean) => ["institutions", { staff }] as const,
    phases: () => ["phases"] as const,
    claimTypes: (phaseId: number) => ["claimTypes", phaseId] as const,
    states: () => ["states"] as const,
    categories: () => ["categories"] as const,
    badges: () => ["badges"] as const,
    myBadges: () => ["badges", "mine"] as const,
    claims: {
        list: (filters: object) => ["claims", "list", filters] as const,
        detail: (id: number) => ["claims", "detail", id] as const,
        adminList: (filters: object) => ["claims", "admin", filters] as const,
    },
    leaderboards: {
        individual: (phaseId: number, institutionId: number | undefined, type: string) =>
            ["leaderboards", "individual", phaseId, institutionId, type] as const,
        institution: (phaseId: number, type: string) => ["leaderboards", "institution", phaseId, type] as const,
        cumulative: () => ["leaderboards", "cumulative"] as const,
    },
    disqualifications: (filters: object) => ["disqualifications", filters] as const,
    scoreAdjustments: (filters: object) => ["scoreAdjustments", filters] as const,
    snapshots: (phaseId?: number) => ["snapshots", phaseId] as const,
    dashboard: () => ["dashboard"] as const,
    communitySubmissions: (staff: boolean) => ["communitySubmissions", { staff }] as const,
}
