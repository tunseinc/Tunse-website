import { Tag, Tooltip } from "antd"
import { RISK_META, type RiskReason } from "./riskFlags"

export function RiskFlagTag({ reason }: { reason: RiskReason }) {
    const meta = RISK_META[reason]
    return (
        <Tooltip title={meta.description}>
            <Tag color={meta.color} bordered={false}>
                {meta.label}
            </Tag>
        </Tooltip>
    )
}
