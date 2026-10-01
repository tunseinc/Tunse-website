import { defineConfig, devices } from "@playwright/test"

const FRONTEND_PORT = 5183
const BACKEND_PORT = 8090
const BACKEND_DIR = "../tunse-challenge-api"

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: false,
    workers: 1,
    retries: 0,
    reporter: [["list"]],
    use: {
        baseURL: `http://localhost:${FRONTEND_PORT}`,
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: [
        {
            // `php artisan serve` spawns the actual PHP built-in server as a child
            // process without forwarding arbitrary custom env vars (only a fixed
            // subset), so CORS for this port can't be set via `env` here — the
            // backend's .env FRONTEND_URL already includes this port instead.
            command: `cd ${BACKEND_DIR} && composer run e2e:reset && php artisan serve --port=${BACKEND_PORT}`,
            url: `http://127.0.0.1:${BACKEND_PORT}/up`,
            reuseExistingServer: !process.env.CI,
            timeout: 60_000,
        },
        {
            command: `npm run dev -- --port ${FRONTEND_PORT} --strictPort`,
            url: `http://localhost:${FRONTEND_PORT}`,
            reuseExistingServer: !process.env.CI,
            timeout: 30_000,
            env: {
                VITE_API_BASE_URL: `http://127.0.0.1:${BACKEND_PORT}/api`,
            },
        },
    ],
})
