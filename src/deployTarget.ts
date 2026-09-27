/**
 * Deploy target + GTIH SDK URL, supplied by the environment (shell, `.env*`,
 * or Docker `-e` / `--build-arg`), never hard-coded per deployment:
 *
 *   DEPLOY_TARGET  `dev` (default) | `prod` — picks a hard-wired GTIH origin.
 *   GTIH_SDK_URL   Absolute URL of gtih-sdk.js; overrides DEPLOY_TARGET.
 *
 * Values are read by Vite when the dev server starts or when `vite build` runs.
 */
export type DeployTarget = "dev" | "prod";

export const HARDWIRED_ORIGINS = {
  gtihDev: "http://localhost:8080",
  gtihProd: "https://gtih-image-latest.onrender.com",
  tegriaDev: "http://localhost:5173",
  tegriaProd: "https://tgfe-image-latest.onrender.com",
} as const;

const GTIH_SDK_PATH = "/gt2/gtih/gtih-sdk.js";

function readDeployTarget(): DeployTarget {
  const raw = String(import.meta.env.DEPLOY_TARGET ?? "").trim().toLowerCase();
  if (raw === "prod" || raw === "dev") return raw;
  if (raw) {
    console.warn(`[tegria] Unknown DEPLOY_TARGET="${raw}", falling back to "dev".`);
  }
  return "dev";
}

export const DEPLOY_TARGET: DeployTarget = readDeployTarget();

const GTIH_SDK_URL_OVERRIDE = String(import.meta.env.GTIH_SDK_URL ?? "").trim();

export function isProdDeploy(): boolean {
  return DEPLOY_TARGET === "prod";
}

export function resolveGtihOrigin(): string {
  if (GTIH_SDK_URL_OVERRIDE) {
    return new URL(GTIH_SDK_URL_OVERRIDE, window.location.href).origin;
  }
  return isProdDeploy()
    ? HARDWIRED_ORIGINS.gtihProd
    : HARDWIRED_ORIGINS.gtihDev;
}

/** Sole pre-execution GTIH fact for Tegria: absolute SDK URL. */
export function resolveGtihSdkUrl(): string {
  return GTIH_SDK_URL_OVERRIDE || `${resolveGtihOrigin()}${GTIH_SDK_PATH}`;
}
