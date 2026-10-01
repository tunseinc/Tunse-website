import { FaCut, FaBolt, FaVideo } from "react-icons/fa"
import type { IconType } from "react-icons"
import Masonry from "../../components/Icons/services/Masonry"
import Plumbing from "../../components/Icons/services/Plumbing"
import HousePainting from "../../components/Icons/services/HousePainting"
import Carpentary from "../../components/Icons/services/Carpentary"
import Tiler from "../../components/Icons/services/Tiler"
import Fumigate from "../../components/Icons/services/Fumigate"
import HouseCleaning from "../../components/Icons/services/HouseCleaning"
import LaunIron from "../../components/Icons/services/LaunIron"
import Barbing from "../../components/Icons/services/Barbing"
import HairDressing from "../../components/Icons/services/HairDressing"
import Electrician from "../../components/Icons/services/Electrician"
import GeneratorRepairs from "../../components/Icons/services/GeneratorRepairs"
import Mechanic from "../../components/Icons/services/Mechanic"
import AirConditioning from "../../components/Icons/services/AirConditioning"
import Makeup from "../../components/Icons/services/Makeup"
import type { CategoryDef } from "./types"

// Rotating brand palette already used for category badges on the homepage
// (src/pages/home/services-data.ts).
const PALETTE = ["#232332", "#8EBE6E", "#F9AA33", "#cdf1b2", "#BE6E8E"]

export interface PriorityCategory extends CategoryDef {
    /** Existing hand-authored SVG icon (fill="black", rendered on a colored badge). */
    Icon?: React.ComponentType
    /** Fallback react-icons component for categories with no existing SVG. */
    FallbackIcon?: IconType
}

export const priorityCategories: PriorityCategory[] = [
    { id: "bricklayer", label: "Bricklayer", Icon: Masonry, bgColor: PALETTE[0] },
    { id: "plumber", label: "Plumber", Icon: Plumbing, bgColor: PALETTE[1] },
    { id: "house-painter", label: "House Painter", Icon: HousePainting, bgColor: PALETTE[2] },
    { id: "carpenter", label: "Carpenter/Furniture Maker", Icon: Carpentary, bgColor: PALETTE[3] },
    { id: "tiler", label: "Tiler", Icon: Tiler, bgColor: PALETTE[4] },
    { id: "fumigation", label: "Fumigation", Icon: Fumigate, bgColor: PALETTE[0] },
    { id: "home-cleaning", label: "Home Cleaning", Icon: HouseCleaning, bgColor: PALETTE[1] },
    { id: "laundry-ironing", label: "Laundry & Ironing", Icon: LaunIron, bgColor: PALETTE[2] },
    { id: "barber", label: "Barber", Icon: Barbing, bgColor: PALETTE[3] },
    { id: "hairstylist", label: "Hairstylist", Icon: HairDressing, bgColor: PALETTE[4] },
    { id: "electrician", label: "Electrician", Icon: Electrician, bgColor: PALETTE[0] },
    { id: "generator-repair", label: "Generator Repair", Icon: GeneratorRepairs, bgColor: PALETTE[1] },
    { id: "mechanic", label: "Mechanic", Icon: Mechanic, bgColor: PALETTE[2] },
    { id: "tailor", label: "Tailor", FallbackIcon: FaCut, bgColor: PALETTE[3] },
    { id: "ac-repair", label: "AC Repair", Icon: AirConditioning, bgColor: PALETTE[4] },
    { id: "makeup", label: "Makeup", Icon: Makeup, bgColor: PALETTE[0] },
    { id: "solar-installation", label: "Solar Installation", FallbackIcon: FaBolt, bgColor: PALETTE[1] },
    { id: "cctv-installation", label: "CCTV Installation", FallbackIcon: FaVideo, bgColor: PALETTE[2] },
]

export const categoryById = (id: string) => priorityCategories.find((c) => c.id === id)
