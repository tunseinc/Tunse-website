import { test, expect } from "@playwright/test"
import { loginAs, E2E_ADMIN, E2E_STUDENT } from "./helpers"

/**
 * This journey freezes Phase 1 for the rest of the suite, so it must run
 * after any journey that depends on Phase 1 accepting new submissions
 * (numbered before this file) and before any that don't care (numbered after).
 */
test("freezing a phase blocks new student claim submissions for it", async ({ page }) => {
    await loginAs(page, E2E_ADMIN)
    await expect(page.getByText("Admin Dashboard")).toBeVisible({ timeout: 15000 })

    await page.getByRole("tab", { name: "Phase Controls" }).click()
    const phase1Card = page.locator(".ant-card", { hasText: "Build the Tunse Workforce" })
    await phase1Card.getByRole("button", { name: /Advance to frozen/i }).click()
    await page.getByRole("button", { name: "OK" }).click()
    await expect(phase1Card.getByText("Final state").or(phase1Card.getByRole("button", { name: /Advance to closed/i }))).toBeVisible({
        timeout: 10000,
    })

    await page.evaluate(() => localStorage.clear())
    await loginAs(page, E2E_STUDENT)
    await expect(page.getByText("Welcome back")).toBeVisible({ timeout: 15000 })

    await page.goto("/challenge/student/claims/new")
    // Once frozen, Phase 1 is no longer the active phase, so the submit page
    // should report there is nothing open to submit against.
    await expect(page.getByText(/No phase is currently open/)).toBeVisible({ timeout: 10000 })
})
