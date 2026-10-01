import { Link } from "react-router"
import LogoWhite from "../../Icons/Logo-white"

interface ChallengeLogoProps {
    variant?: "light" | "dark"
    to?: string
}

/** "light" = for use on white headers (uses the raster Tunse wordmark).
 *  "dark" = for use on the dark Sider background (uses the white SVG wordmark). */
export function ChallengeLogo({ variant = "light", to = "/challenge" }: ChallengeLogoProps) {
    return (
        <Link to={to} className="flex items-center gap-2 shrink-0">
            {variant === "dark" ? (
                <div className="w-28 [&>svg]:w-full [&>svg]:h-auto">
                    <LogoWhite />
                </div>
            ) : (
                <img src="/assets/images/TUNSE.png" alt="Tunse" className="h-8 w-auto" />
            )}
            <span
                className={`text-xs font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${variant === "dark" ? "bg-[#393A10] text-[#EEFFE2]" : "bg-[#EEFFE2] text-[#393A10]"
                    }`}
            >
                Challenge
            </span>
        </Link>
    )
}
