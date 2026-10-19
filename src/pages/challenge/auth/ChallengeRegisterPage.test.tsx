import { describe, expect, it, vi, beforeEach } from "vitest"
import userEvent from "@testing-library/user-event"
import ChallengeRegisterPage from "./ChallengeRegisterPage"
import { renderWithProviders } from "../../../test/testUtils"
import * as institutionsApi from "../../../lib/api/institutions"
import { useAuthStore } from "../../../stores/authStore"

// antd's Select dropdown measures itself with ResizeObserver, which jsdom doesn't provide.
globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
}

const institutions = [
    { id: 1, name: "Olabisi Onabanjo University, Ago-Iwoye", short_code: "OOU", state: "Ogun", active: true },
    { id: 2, name: "University of Lagos", short_code: "UNILAG", state: "Lagos", active: true },
]

async function fillAccountStep(user: ReturnType<typeof userEvent.setup>, getByLabelText: (label: string) => HTMLElement, phone: string) {
    await user.type(getByLabelText("Full name"), "Jane Student")
    await user.type(getByLabelText("Email"), "jane@example.com")
    await user.type(getByLabelText("Phone / WhatsApp"), phone)
    await user.type(getByLabelText("Password"), "password123")
    await user.type(getByLabelText("Confirm password"), "password123")
}

describe("ChallengeRegisterPage", () => {
    beforeEach(() => {
        useAuthStore.setState({ token: null, user: null })
        vi.restoreAllMocks()
        vi.spyOn(institutionsApi, "fetchInstitutions").mockResolvedValue(institutions)
    })

    it("blocks the account step when an email address is typed into the phone field", async () => {
        const user = userEvent.setup()
        const { getByLabelText, getByRole, findByText, queryByLabelText } = renderWithProviders(
            <ChallengeRegisterPage />,
        )

        await fillAccountStep(user, getByLabelText, "jane@example.com")
        await user.click(getByRole("button", { name: "Continue" }))

        expect(await findByText("Enter a valid Nigerian mobile number, e.g. 0801 234 5678")).toBeInTheDocument()
        expect(queryByLabelText("Institution")).not.toBeInTheDocument()
    })

    it("only lists institutions in the selected state", async () => {
        const user = userEvent.setup()
        const { getByLabelText, getByRole, findByLabelText, findByTitle, queryByTitle } = renderWithProviders(
            <ChallengeRegisterPage />,
        )

        await fillAccountStep(user, getByLabelText, "0801 234 5678")
        await user.click(getByRole("button", { name: "Continue" }))

        expect(await findByLabelText("Institution")).toBeDisabled()

        await user.click(getByLabelText("State of your institution"))
        await user.click(await findByTitle("Ogun"))
        await user.click(getByLabelText("Institution"))

        expect(await findByTitle("Olabisi Onabanjo University, Ago-Iwoye")).toBeInTheDocument()
        expect(queryByTitle("University of Lagos")).not.toBeInTheDocument()
    })

    it("suggests courses but accepts a course typed in that isn't listed", async () => {
        const user = userEvent.setup()
        const { getByLabelText, getByRole, findByLabelText, findByTitle, queryByText, findByText } =
            renderWithProviders(<ChallengeRegisterPage />)

        await fillAccountStep(user, getByLabelText, "08012345678")
        await user.click(getByRole("button", { name: "Continue" }))

        await user.type(await findByLabelText("Department / Course"), "Comput")
        expect(await findByTitle("Computer Science")).toBeInTheDocument()

        await user.clear(getByLabelText("Department / Course"))
        await user.type(getByLabelText("Department / Course"), "Underwater Basket Weaving")
        await user.click(getByLabelText("State of your institution"))
        await user.click(await findByTitle("Ogun"))
        await user.click(getByLabelText("Institution"))
        await user.click(await findByTitle("Olabisi Onabanjo University, Ago-Iwoye"))
        await user.click(getByLabelText("Graduation year (completed or expected)"))
        await user.click(await findByTitle("2015"))
        await user.click(getByRole("button", { name: "Continue" }))

        expect(await findByText("Student ID upload")).toBeInTheDocument()
        expect(queryByText("Enter your department or course")).not.toBeInTheDocument()
    })
})
