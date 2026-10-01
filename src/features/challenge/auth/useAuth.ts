import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchCurrentUser, login, logout, register, resendVerificationEmail, verifyEmail } from "../../../lib/api/auth"
import type { LoginPayload, RegisterPayload } from "../../../lib/api/auth"
import { queryKeys } from "../../../lib/queryKeys"
import { useAuthStore } from "../../../stores/authStore"

export function useLogin() {
    const setAuth = useAuthStore((s) => s.login)

    return useMutation({
        mutationFn: (payload: LoginPayload) => login(payload),
        onSuccess: (data) => setAuth(data.token, data.user),
    })
}

export function useRegister() {
    const setAuth = useAuthStore((s) => s.login)

    return useMutation({
        mutationFn: (payload: RegisterPayload) => register(payload),
        onSuccess: (data) => setAuth(data.token, data.user),
    })
}

export function useLogout() {
    const clearAuth = useAuthStore((s) => s.logout)
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => logout(),
        onSettled: () => {
            clearAuth()
            queryClient.clear()
        },
    })
}

export function useCurrentUser() {
    const token = useAuthStore((s) => s.token)

    return useQuery({
        queryKey: queryKeys.me(),
        queryFn: fetchCurrentUser,
        enabled: !!token,
        staleTime: 60_000,
    })
}

export function useResendVerification() {
    return useMutation({
        mutationFn: () => resendVerificationEmail(),
    })
}

export function useVerifyEmail() {
    return useMutation({
        mutationFn: ({ id, hash, expires, signature }: { id: string; hash: string; expires: string; signature: string }) =>
            verifyEmail(id, hash, { expires, signature }),
    })
}
