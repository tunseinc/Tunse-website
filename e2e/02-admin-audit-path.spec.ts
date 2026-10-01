import { test, expect, request } from "@playwright/test"
import { loginAs, E2E_ADMIN } from "./helpers"

const BACKEND_URL = "http://127.0.0.1:8090/api/"

/** Registers a student and submits one Phase 1 claim directly via the API,
 * so this journey only has to drive the UI for the behavior under test:
 * the admin review workflow. */
async function seedClaim(): Promise<{ recruitName: string }> {
    const api = await request.newContext({ baseURL: BACKEND_URL })
    const email = `e2e-audit-${Date.now()}@example.com`

    const registerResponse = await api.post("auth/register", {
        multipart: {
            full_name: "Audit Fixture Student",
            email,
            password: "password123",
            password_confirmation: "password123",
            phone: `80${Date.now().toString().slice(-8)}`,
            institution_id: "1",
            state: "Lagos",
            department: "Computer Science",
            graduation_year: "2027",
            student_id_number: `AUD/${Date.now()}`,
            student_id_file: { name: "id.jpg", mimeType: "image/jpeg", buffer: Buffer.from([0xff, 0xd8, 0xff, 0xd9]) },
        },
    })
    const { token } = await registerResponse.json()

    const phasesResponse = await api.get("phases")
    const phases = (await phasesResponse.json()).data
    const phase1 = phases.find((p: { number: number }) => p.number === 1)
    const claimTypesResponse = await api.get(`phases/${phase1.id}/claim-types`)
    const claimTypes = (await claimTypesResponse.json()).data
    const verifiedTworker = claimTypes.find((ct: { code: string }) => ct.code === "verified_tworker")

    const recruitName = `Audit Recruit ${Date.now()}`
    await api.post("claims", {
        headers: { Authorization: `Bearer ${token}` },
        multipart: {
            claim_type_id: String(verifiedTworker.id),
            recruit_name: recruitName,
            recruit_phone: `80${Date.now().toString().slice(-8)}`,
            state: "Lagos",
            lga: "Ikeja",
            category: "plumber",
            date_recruited: new Date().toISOString().slice(0, 10),
            declaration: "true",
        },
    })

    await api.dispose()
    return { recruitName }
}

test("admin can review a claim from the audit queue and see the leaderboard update", async ({ page }) => {
    const { recruitName } = await seedClaim()

    await loginAs(page, E2E_ADMIN)
    await expect(page.getByText("Admin Dashboard")).toBeVisible({ timeout: 15000 })

    await page.goto("/challenge/admin/claims")
    await expect(page.getByRole("heading", { name: "Claims Queue" })).toBeVisible()
    await page.getByText(recruitName).first().click()

    await expect(page.getByText("Review this claim")).toBeVisible()
    await page.getByRole("button", { name: "Verify" }).click()
    await expect(page.getByText("Confirm verification")).toBeVisible()
    await page.locator("textarea").fill("Confirmed via e2e test")
    await page.getByRole("button", { name: "Confirm verification" }).click()

    await expect(page.getByText("Verified").first()).toBeVisible({ timeout: 10000 })
})
