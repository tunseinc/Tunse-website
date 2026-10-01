import { Statistic } from "antd"

interface CountdownTimerProps {
    title: string
    targetIso: string
}

export function CountdownTimer({ title, targetIso }: CountdownTimerProps) {
    return (
        <Statistic.Countdown
            title={title}
            value={new Date(targetIso).getTime()}
            format="D[d] H[h] m[m] s[s]"
        />
    )
}
