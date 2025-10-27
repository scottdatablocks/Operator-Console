/* Harmonix Endpoint Shim v1 — fallback to /data/*_latest.json when live endpoints fail */
(function () {
  const map = {
    "/metrics/runtime_status.json": "/data/runtime_latest.json",
    "/security/boot_guard_report.json": "/data/security_latest.json",
    "/preflight/reports/latest.json": "/data/preflight_latest.json",
  };
  const isReplayHost = /data-blocks\.ai$/i.test(location.hostname);

  async function tryFetch(url, init) {
    // First attempt: original URL (unless on replay host, prefer /data)
    if (!isReplayHost) {
      const r1 = await fetch(url, init).catch(()=>null);
      if (r1 && r1.ok) return r1;
    }
    // Fallback: mapped /data/*_latest.json (if mapping exists)
    const u = new URL(url, location.origin);
    const path = u.pathname;
    const fb = map[path] || null;
    if (fb) {
      const r2 = await fetch(fb, init).catch(()=>null);
      if (r2 && r2.ok) return r2;
    }
    // Last chance: original again (for replay hosts where data map might be stale)
    const r3 = await fetch(url, init).catch(()=>null);
    if (r3 && r3.ok) return r3;

    // Construct a useful error
    throw new Error(`HMX EndpointShim: failed for ${url} (replay=${isReplayHost})`);
  }

  // Patch window.HMX_FETCH if modules want to use it, without breaking native fetch.
  window.HMX_FETCH = tryFetch;
})();
