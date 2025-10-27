/* Harmonix Endpoint Shim v8 — maps live -> /data/*_latest.json on failure */
(function () {
  const map = {
    "/metrics/runtime_status.json": "/data/runtime_latest.json",
    "/security/boot_guard_report.json": "/data/security_latest.json",
    "/preflight/reports/latest.json": "/data/preflight_latest.json",
    "/metrics/pods_provider.json": "/data/pods_latest.json"
  };
  async function fetchWithReplay(url, init) {
    // try live first
    try {
      const r = await fetch(url, init);
      if (r.ok) return r;
    } catch {}
    // fallback if mapped
    const fb = map[url];
    if (!fb) throw new Error("No fallback for "+url);
    const r2 = await fetch(fb, init);
    return r2;
  }
  window.hmxFetch = fetchWithReplay;
})();
