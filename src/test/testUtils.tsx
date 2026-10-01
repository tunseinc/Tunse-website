import type { ReactElement, ReactNode } from "react"
import { render } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MemoryRouter } from "react-router"

export function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0 },
            mutations: { retry: false },
        },
    })
}

export function renderWithProviders(
    ui: ReactElement,
    { route = "/", queryClient = createTestQueryClient() }: { route?: string; queryClient?: QueryClient } = {},
) {
    function Wrapper({ children }: { children: ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
            </QueryClientProvider>
        )
    }

    return { queryClient, ...render(ui, { wrapper: Wrapper }) }
}
