/**
 * Harmonix Operator Console API Utilities
 * Endpoints aligned with v9.0 Technical Specification
 */

const API_ENDPOINTS = {
  RUNTIME_STATUS: "/metrics/runtime_status.json",
  BOOT_GUARD: "/security/boot_guard_report.json",
  PREFLIGHT_LATEST: "/preflight/reports/latest.json",
  PODS_PROVIDER: "/metrics/pods_provider.json",
  RULES_INDEX: "/security/rules/rules_index.json",
};

// Fallback endpoints for development/replay
const FALLBACK_ENDPOINTS = {
  "/metrics/runtime_status.json": "/data/runtime_latest.json",
  "/security/boot_guard_report.json": "/data/security_latest.json",
  "/preflight/reports/latest.json": "/data/preflight_latest.json",
};

/**
 * Fetch JSON data with automatic fallback
 * @param {string} url - Primary endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise<object|null>} JSON data or null on error
 */
export async function fetchJSON(url, options = {}) {
  const defaultOptions = {
    cache: "no-cache",
    ...options,
  };

  try {
    // Try primary endpoint
    let response = await fetch(url, defaultOptions);

    // If primary fails and we have a fallback, try it
    if (!response.ok && FALLBACK_ENDPOINTS[url]) {
      console.warn(`Primary endpoint ${url} failed, trying fallback`);
      response = await fetch(FALLBACK_ENDPOINTS[url], defaultOptions);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API fetch error for ${url}:`, error);
    return null;
  }
}

/**
 * Fetch runtime status metrics
 */
export async function fetchRuntimeStatus() {
  return fetchJSON(API_ENDPOINTS.RUNTIME_STATUS);
}

/**
 * Fetch boot guard security report
 */
export async function fetchBootGuard() {
  return fetchJSON(API_ENDPOINTS.BOOT_GUARD);
}

/**
 * Fetch latest preflight validation report
 */
export async function fetchPreflightReport() {
  return fetchJSON(API_ENDPOINTS.PREFLIGHT_LATEST);
}

/**
 * Fetch provider pods status
 */
export async function fetchProviderPods() {
  return fetchJSON(API_ENDPOINTS.PODS_PROVIDER);
}

/**
 * Fetch security rules index
 */
export async function fetchSecurityRules() {
  return fetchJSON(API_ENDPOINTS.RULES_INDEX);
}

/**
 * Fetch all dashboard data in parallel
 * @returns {Promise<{runtime, security, preflight}>}
 */
export async function fetchDashboardData() {
  const [runtime, security, preflight] = await Promise.all([
    fetchRuntimeStatus(),
    fetchBootGuard(),
    fetchPreflightReport(),
  ]);

  return { runtime, security, preflight };
}
