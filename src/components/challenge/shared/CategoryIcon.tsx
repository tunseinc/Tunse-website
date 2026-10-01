import { categoryById } from "../../../data/challenge"

interface CategoryIconProps {
    categoryId: string
    size?: number
}

/**
 * Existing service SVGs hardcode fill="black" (not currentColor), so they
 * can't be recolored via CSS. Matches the homepage pattern instead: a fixed
 * black icon sitting on a colored circular badge (see services-data.ts).
 */
export function CategoryIcon({ categoryId, size = 40 }: CategoryIconProps) {
    const category = categoryById(categoryId)
    if (!category) return null

    const Icon = category.Icon
    const Fallback = category.FallbackIcon

    return (
        <div
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ background: category.bgColor, width: size, height: size }}
            title={category.label}
        >
            {Icon ? (
                // The existing service SVGs set explicit width/height="496" attributes on
                // the <svg> root, so a CSS rule targeting the child svg (which wins over
                // presentation attributes) is required to actually scale them down.
                <div
                    className="[&>svg]:w-full [&>svg]:h-full"
                    style={{ width: size * 0.55, height: size * 0.55 }}
                >
                    <Icon />
                </div>
            ) : Fallback ? (
                <Fallback color={category.bgColor === "#EEFFE2" ? "#232332" : "#FFFFFF"} size={size * 0.4} />
            ) : null}
        </div>
    )
}
