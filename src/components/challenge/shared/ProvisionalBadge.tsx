import { Tag, Tooltip } from "antd"
import type { PhaseStatus } from "../../../data/challenge"

interface ProvisionalBadgeProps {
    phaseStatus: PhaseStatus
}

/** Spec requirement: always show a visible provisional-vs-final label while a phase is open. */
export function ProvisionalBadge({ phaseStatus }: ProvisionalBadgeProps) {
    if (phaseStatus === "closed") {
        return <Tag color="success">Final Results</Tag>
    }

    return (
        <Tooltip title="Scores are provisional until Tunse validates claims against the app backend.">
            <Tag color="warning">Provisional — subject to Tunse verification</Tag>
        </Tooltip>
    )
}
