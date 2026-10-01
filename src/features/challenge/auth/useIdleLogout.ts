import { useEffect, useRef } from "react"
import { message } from "antd"
import { useAuthStore } from "../../../stores/authStore"
import { useLogout } from "./useAuth"

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "wheel"] as const

/**
 * Logs the user out after `timeoutMs` of no mouse/keyboard/touch/scroll
 * activity. Only runs while authenticated; each activity event resets the
 * timer rather than tracking a rolling window, so it's a true "idle" timeout.
 */
export function useIdleLogout(timeoutMs = 10 * 60 * 1000) {
    const token = useAuthStore((s) => s.token)
    const logoutMutation = useLogout()
    const logoutRef = useRef(logoutMutation.mutate)
    logoutRef.current = logoutMutation.mutate

    useEffect(() => {
        if (!token) return

        let timer: ReturnType<typeof setTimeout>

        const reset = () => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                message.info("You've been logged out after 10 minutes of inactivity.")
                logoutRef.current()
            }, timeoutMs)
        }

        ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, reset, { passive: true }))
        reset()

        return () => {
            clearTimeout(timer)
            ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, reset))
        }
    }, [token, timeoutMs])
}
