import { test, expect } from "@playwright/test"
import { pickToday, selectAntOption } from "./helpers"

test("student can register, submit a Phase 1 claim, and see it on the leaderboard", async ({ page }) => {
    const email = `e2e-${Date.now()}@example.com`

    await page.goto("/challenge/register")
    await page.locator("#fullName").fill("Playwright Student")
    await page.locator("#email").fill(email)
    await page.locator("#phone").fill("8012345000")
    await page.locator("#password").fill("password123")
    await page.locator("#passwordConfirmation").fill("password123")
    await page.getByRole("button", { name: "Continue" }).click()

    await selectAntOption(page, "#institutionId", "University of Lagos")
    await selectAntOption(page, "#state", "Lagos")
    await page.locator("#department").fill("Computer Science")
    await selectAntOption(page, "#graduationYear", "2027")
    await page.getByRole("button", { name: "Continue" }).click()

    await page.locator("#studentIdNumber").fill("CSC/2021/100")
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({ name: "id.jpg", mimeType: "image/jpeg", buffer: Buffer.from([0xff, 0xd8, 0xff, 0xd9]) })
    await page.getByRole("button", { name: "Continue" }).click()

    await page.getByText(/I confirm this information is accurate/).click()
    await page.getByRole("button", { name: "Complete registration" }).click()

    await expect(page.getByText("You're in! Welcome to the Challenge.")).toBeVisible({ timeout: 15000 })
    const challengeIdMatch = await page.locator("strong").first().innerText()
    expect(challengeIdMatch).toMatch(/^TCH-UNILAG-\d+$/)

    await page.getByRole("link", { name: "Go to my dashboard" }).click()
    await expect(page.getByText("Welcome back")).toBeVisible({ timeout: 15000 })

    // Submit a Phase 1 claim
    await page.getByRole("link", { name: "Submit a new claim" }).click()
    await expect(page.getByText("Submit a Claim")).toBeVisible()

    await page.locator(".ant-radio-button-wrapper", { hasText: "Active Verifier" }).click()
    await page.locator("#recruitName").fill("Playwright Recruit")
    await page.locator("#recruitPhone").fill(`80${Date.now().toString().slice(-8)}`)
    await selectAntOption(page, "#state", "Lagos")
    await selectAntOption(page, "#lga", "Ikeja")
    await selectAntOption(page, "#category", "Plumber")
    await pickToday(page, "#dateRecruited")
    await page.getByRole("button", { name: "Continue" }).click()

    await page.getByRole("button", { name: "Continue" }).click()

    await page.getByText(/I confirm this recruitment is genuine/).click()
    await page.getByRole("button", { name: "Submit claim" }).click()

    await expect(page.getByText("Claim submitted")).toBeVisible({ timeout: 15000 })

    await page.getByRole("link", { name: "View my claims" }).click()
    await expect(page.getByText("Playwright Recruit")).toBeVisible()

    // The student should also appear on the provisional individual leaderboard
    await page.goto("/challenge/student/leaderboard/individual")
    await expect(page.getByRole("heading", { name: "Individual Leaderboard" })).toBeVisible()
    await expect(page.getByRole("table").getByText("Playwright Student", { exact: false }).first()).toBeVisible({
        timeout: 10000,
    })
})
