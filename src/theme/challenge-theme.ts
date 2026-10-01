import type { ThemeConfig } from "antd"

/**
 * Ant Design theme tokens mapped from the Tunse brand palette already in use
 * across the marketing site (see Navbar.tsx, services-data.ts).
 */
export const challengeTheme: ThemeConfig = {
    token: {
        colorPrimary: "#98BC77",
        colorInfo: "#354B60",
        colorSuccess: "#668A44",
        colorWarning: "#F9AA33",
        colorError: "#CF4F4F",
        colorLink: "#393A10",
        colorLinkHover: "#82aa5c",
        colorTextBase: "#232332",
        colorBgLayout: "#F7F9F4",
        colorBorder: "#E3E8DC",
        fontFamily: `"Roboto", sans-serif`,
        borderRadius: 10,
        borderRadiusLG: 14,
        wireframe: false,
    },
    components: {
        Button: {
            borderRadius: 999,
            borderRadiusLG: 999,
            borderRadiusSM: 999,
            controlHeight: 40,
            colorPrimaryHover: "#82aa5c",
            primaryShadow: "none",
        },
        Tag: {
            borderRadiusSM: 999,
        },
        Layout: {
            headerBg: "#FFFFFF",
            siderBg: "#232332",
            bodyBg: "#F7F9F4",
            headerHeight: 64,
        },
        Menu: {
            darkItemBg: "#232332",
            darkItemSelectedBg: "#393A10",
            darkItemHoverBg: "#354B60",
            darkItemColor: "#CFDBFA",
            darkItemSelectedColor: "#FFFFFF",
        },
        Card: {
            borderRadiusLG: 16,
        },
        Steps: {
            colorPrimary: "#668A44",
        },
    },
}
