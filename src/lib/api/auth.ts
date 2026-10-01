import { apiClient } from "./client"
import type { AuthUser } from "../../stores/authStore"

export interface LoginPayload {
    email: string
    password: string
}

export interface RegisterPayload {
    full_name: string
    email: string
    password: string
    password_confirmation: string
    phone: string
    institution_id: number
    state: string
    department: string
    graduation_year: number
    student_id_number: string
    student_id_file: File
}

export interface AuthResponse {
    user: AuthUser
    token: string
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", payload)
    return data
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
    const formData = new FormData()
    Object.entries(payload).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value)
        } else {
            formData.append(key, String(value))
        }
    })

    const { data } = await apiClient.post<AuthResponse>("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    return data
}

export async function logout(): Promise<void> {
    await apiClient.post("/auth/logout")
}

export async function fetchCurrentUser(): Promise<{ user: AuthUser }> {
    const { data } = await apiClient.get<{ user: AuthUser }>("/auth/me")
    return data
}
