import { StyleProvider } from "@ant-design/cssinjs"
import { App as AntdApp, ConfigProvider } from "antd"
import type { PropsWithChildren } from "react"
import { challengeTheme } from "./challenge-theme"

/**
 * Scopes Ant Design (theming + the `layer` CSS priority mechanism that lets
 * Tailwind utility classes win over antd's own component styles) to the
 * /challenge/* subtree only, so the marketing pages are untouched.
 */
export function AntdProvider({ children }: PropsWithChildren) {
    return (
        <StyleProvider layer>
            <ConfigProvider theme={challengeTheme}>
                <AntdApp>{children}</AntdApp>
            </ConfigProvider>
        </StyleProvider>
    )
}
