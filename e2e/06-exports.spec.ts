import { test, expect } from "@playwright/test"
import { loginAs, E2E_ADMIN } from "./helpers"
import * as fs from "node:fs"

test("admin can download claims and institution leaderboard CSV exports", async ({ page }) => {
    await loginAs(page, E2E_ADMIN)
    await expect(page.getByText("Admin Dashboard")).toBeVisible({ timeout: 15000 })

    await page.goto("/challenge/admin/exports")
    await expect(page.getByRole("heading", { name: "Exports" })).toBeVisible()

    const [claimsDownload] = await Promise.all([
        page.waitForEvent("download"),
        page.locator(".ant-card", { hasText: "Claims" }).getByRole("button", { name: "Download CSV" }).click(),
    ])
    const claimsPath = await claimsDownload.path()
    expect(claimsPath).toBeTruthy()
    const claimsContent = fs.readFileSync(claimsPath as string, "utf-8")
    expect(claimsContent.split("\n")[0]).toBe(
        "claimId,student,challengeId,institution,phase,claimType,recruitName,recruitPhone,state,lga,status,provisionalPoints,auditedPoints,createdAt",
    )

    const [leaderboardDownload] = await Promise.all([
        page.waitForEvent("download"),
        page
            .locator(".ant-card", { hasText: "Institution Leaderboard" })
            .getByRole("button", { name: "Download CSV" })
            .click(),
    ])
    const leaderboardPath = await leaderboardDownload.path()
    const leaderboardContent = fs.readFileSync(leaderboardPath as string, "utf-8")
    expect(leaderboardContent.split("\n")[0]).toBe(
        "rank,institution,state,phase,provisionalScore,auditedScore,verifiedParticipants,totalParticipants",
    )
    expect(leaderboardContent.split("\n").length).toBeGreaterThan(1)
})
