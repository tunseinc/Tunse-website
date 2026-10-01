import { Tag, Tooltip } from "antd"

interface PointsPillProps {
    points: number | null
    suffix?: string
}

/** Renders a claim type's point value, or an explicit "TBD" state for
 * points the spec leaves unconfigured pending pilot calibration. */
export function PointsPill({ points, suffix = "pts" }: PointsPillProps) {
    if (points === null) {
        return (
            <Tooltip title="Points for this claim type are pending finalization during the pilot.">
                <Tag color="default">TBD</Tag>
            </Tooltip>
        )
    }
    return <Tag color="green">{points} {suffix}</Tag>
}
