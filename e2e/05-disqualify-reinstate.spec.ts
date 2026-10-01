import { test, expect, request } from "@playwright/test"
import { loginAs, selectAntOption, E2E_ADMIN } from "./helpers"

const BACKEND_URL = "http://127.0.0.1:8090/api/"

/** Finds a real registered student's name via the API, so this journey only
 * has to drive the UI for the behavior under test: disqualify/reinstate. */
async function pickAStudentName(): Promise<string> {
    const api = await request.newContext({ baseURL: BACKEND_URL })
    const loginResponse = await api.post("auth/login", {
        data: { email: E2E_ADMIN.email, password: E2E_ADMIN.password },
    })
    const { token } = await loginResponse.json()

    const phasesResponse = await api.get("phases", { headers: { Authorization: `Bearer ${token}` } })
    const phase1 = (await phasesResponse.json()).data.find((p: { number: number }) => p.number === 1)

    const leaderboardResponse = await api.get(`leaderboards/individual?phase_id=${phase1.id}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    const rows = (await leaderboardResponse.json()).data
    await api.dispose()

    return rows[0].full_name
}

test("admin can disqualify a student (zeroing their leaderboard score) and reinstate them", async ({ page }) => {
    const studentName = await pickAStudentName()

    await loginAs(page, E2E_ADMIN)
    await expect(page.getByText("Admin Dashboard")).toBeVisible({ timeout: 15000 })

    await page.goto("/challenge/admin/disqualifications")
    await page.getByRole("button", { name: "Disqualify" }).click()
    await selectAntOption(page, "#phaseId", "Build the Tunse Workforce")
    await selectAntOption(page, "#targetId", studentName)
    await page.locator("#reason").fill("Fabricated evidence found during e2e review.")
    await page.getByRole("button", { name: "Disqualify" }).nth(1).click()

    await expect(page.getByText("Disqualified").first()).toBeVisible({ timeout: 10000 })

    await page.getByRole("button", { name: "Reinstate" }).first().click()
    await page.getByRole("button", { name: "OK" }).click()

    await expect(page.getByText("Reinstated").first()).toBeVisible({ timeout: 10000 })
})
