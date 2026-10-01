import { describe, expect, it, vi } from "vitest"
import { Form } from "antd"
import { Phase2ClaimFields } from "./Phase2ClaimFields"
import { renderWithProviders } from "../../../../test/testUtils"
import * as claimTypesApi from "../../../../lib/api/claimTypes"
import * as referenceApi from "../../../../lib/api/reference"

const claimTypes = [
    { id: 1, phase_id: 2, code: "registered_customer", label: "Registered Customer", base_points: 5, active: true, validation_rule_text: "" },
    { id: 2, phase_id: 2, code: "qualified_vendor", label: "Qualified Vendor", base_points: null, active: true, validation_rule_text: "" },
]

vi.spyOn(claimTypesApi, "fetchClaimTypesForPhase").mockResolvedValue(claimTypes)
vi.spyOn(referenceApi, "fetchStates").mockResolvedValue([{ state: "Lagos", lgas: ["Ikeja"] }])

function Harness() {
    const [form] = Form.useForm()
    return (
        <Form form={form}>
            <Phase2ClaimFields phaseId={2} />
        </Form>
    )
}

describe("Phase2ClaimFields", () => {
    it("only shows the vendor/business category field when Qualified Vendor is selected", async () => {
        const { queryByText, findByText, getByText } = renderWithProviders(<Harness />)

        await findByText("Registered Customer")
        expect(queryByText("Vendor / business category")).not.toBeInTheDocument()

        getByText("Qualified Vendor").click()

        expect(await findByText("Vendor / business category")).toBeInTheDocument()
    })
})
