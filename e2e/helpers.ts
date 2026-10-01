import type { Page } from "@playwright/test"

export const E2E_STUDENT = { email: "e2e-student@tunse.test", password: "password" }
export const E2E_ADMIN = { email: "e2e-admin@tunse.test", password: "password" }
export const E2E_AUDITOR = { email: "e2e-auditor@tunse.test", password: "password" }

export async function loginAs(page: Page, credentials: { email: string; password: string }) {
    await page.goto("/challenge/login")
    await page.getByLabel("Email").fill(credentials.email)
    await page.getByLabel("Password").fill(credentials.password)
    await page.getByRole("button", { name: "Log in" }).click()
}

/**
 * Selects an antd Select option by visible text. Closed dropdowns stay in the
 * DOM (just hidden via a class, not display:none), so this scopes strictly to
 * the dropdown panel that is currently open rather than matching any stale
 * option content from a previously-opened Select sharing the same classes.
 */
export async function selectAntOption(page: Page, triggerSelector: string, optionText: string) {
    await page.click(triggerSelector)
    const openDropdown = page.locator(".ant-select-dropdown:not(.ant-select-dropdown-hidden)").last()
    await openDropdown.locator(".ant-select-item-option-content", { hasText: optionText }).first().click()
}

/** Picks today's date in an open antd DatePicker calendar. */
export async function pickToday(page: Page, triggerSelector: string) {
    await page.click(triggerSelector)
    await page.locator(".ant-picker-cell-today").first().click()
}
