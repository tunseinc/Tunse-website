import { Tag } from "antd"
import type { ClaimStatus } from "../../../data/challenge"

const STATUS_META: Record<ClaimStatus, { label: string; color: string }> = {
    submitted: { label: "Pending / Unaudited", color: "gold" },
    verified: { label: "Verified", color: "success" },
    rejected: { label: "Rejected", color: "error" },
    flagged: { label: "Flagged", color: "volcano" },
    correction_requested: { label: "Correction Requested", color: "processing" },
}

export function ClaimStatusTag({ status }: { status: ClaimStatus }) {
    const meta = STATUS_META[status]
    return (
        <Tag color={meta.color} bordered={false}>
            {meta.label}
        </Tag>
    )
}
