import { Tag } from "antd"
import type { PhaseStatus } from "../../../data/challenge"

const STATUS_META: Record<PhaseStatus, { label: string; color: string }> = {
    draft: { label: "Draft", color: "default" },
    open: { label: "Open", color: "success" },
    frozen: { label: "Frozen", color: "processing" },
    closed: { label: "Closed", color: "default" },
}

export function PhaseBadge({ status }: { status: PhaseStatus }) {
    const meta = STATUS_META[status]
    return <Tag color={meta.color}>{meta.label}</Tag>
}
