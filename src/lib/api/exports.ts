import { apiClient } from "./client"

export type ExportKind = "claims" | "students" | "institutions" | "audit-log" | "leaderboard-institution" | "leaderboard-individual"

const EXPORT_PATHS: Record<ExportKind, string> = {
    claims: "/admin/exports/claims.csv",
    students: "/admin/exports/students.csv",
    institutions: "/admin/exports/institutions.csv",
    "audit-log": "/admin/exports/audit-log.csv",
    "leaderboard-institution": "/admin/exports/leaderboard/institution.csv",
    "leaderboard-individual": "/admin/exports/leaderboard/individual.csv",
}

/**
 * Downloads a CSV export by fetching it as an authenticated blob and triggering
 * a browser save, since the endpoint requires a Bearer token a plain <a href>
 * link cannot send.
 */
export async function downloadExport(kind: ExportKind, params: Record<string, unknown> = {}): Promise<void> {
    const response = await apiClient.get(EXPORT_PATHS[kind], { params, responseType: "blob" })
    const disposition = response.headers["content-disposition"] as string | undefined
    const filenameMatch = disposition?.match(/filename="?([^"]+)"?/)
    const filename = filenameMatch?.[1] ?? `${kind}.csv`

    const url = window.URL.createObjectURL(response.data as Blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}
