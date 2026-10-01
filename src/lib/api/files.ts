import { apiClient } from "./client"

/**
 * Fetches a protected file (claim photo or student ID) as an authenticated
 * blob and returns an object URL suitable for an <img src> or download link.
 * Callers must revoke the returned URL (URL.revokeObjectURL) when done with it.
 */
export async function fetchProtectedFileUrl(path: string): Promise<string> {
    const response = await apiClient.get(path, { responseType: "blob" })
    return window.URL.createObjectURL(response.data as Blob)
}

export function claimPhotoPath(claimId: number): string {
    return `/claims/${claimId}/photo`
}

export function studentIdFilePath(studentProfileId: number): string {
    return `/students/${studentProfileId}/id-file`
}
