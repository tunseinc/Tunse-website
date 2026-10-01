import { apiClient } from "./client"

export interface StateLga {
    state: string
    lgas: string[]
}

export interface CategoryOption {
    id: number
    code: string
    label: string
    bg_color: string | null
}

export async function fetchStates(): Promise<StateLga[]> {
    const { data } = await apiClient.get<{ data: StateLga[] }>("/states")
    return data.data
}

export async function fetchCategories(): Promise<CategoryOption[]> {
    const { data } = await apiClient.get<{ data: CategoryOption[] }>("/categories")
    return data.data
}
