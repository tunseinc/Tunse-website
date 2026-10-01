import { test, expect } from "@playwright/test"
import { loginAs, E2E_STUDENT } from "./helpers"

test.describe("auth guards", () => {
    test("logged-out visits to student and admin dashboards redirect to login", async ({ page }) => {
        await page.goto("/challenge/student/dashboard")
        await expect(page).toHaveURL(/\/challenge\/login/)

        await page.goto("/challenge/admin/dashboard")
        await expect(page).toHaveURL(/\/challenge\/login/)
    })

    test("a logged-in student cannot reach the admin dashboard", async ({ page }) => {
        await loginAs(page, E2E_STUDENT)
        await expect(page.getByText("Welcome back")).toBeVisible({ timeout: 15000 })

        await page.goto("/challenge/admin/dashboard")
        await expect(page).not.toHaveURL(/\/challenge\/admin\/dashboard/)
        await expect(page.getByText("Welcome back")).toBeVisible({ timeout: 10000 })
    })
})
