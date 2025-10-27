// Harmonix UI — Floating Design Doc Button (always visible)
(function () {
  const PDF = "docs/HMX_MissionControl_DesignDoc_v1.2.pdf";
  function ready(fn){ document.readyState !== "loading" ? fn() : document.addEventListener("DOMContentLoaded", fn); }

  ready(() => {
    // If already added, bail
    if (document.querySelector("#hmx-doc-btn")) return;

    // Create style once
    const css = document.createElement("style");
    css.textContent = `
      #hmx-doc-btn {
        position: fixed;
        top: 12px;
        right: 12px;
        z-index: 9999;
        padding: 8px 12px;
        border-radius: 8px;
        font-weight: 700;
        text-decoration: none !important;
        color: #fff !important;
        background: linear-gradient(135deg,#1d6ee8 0%,#33b3ff 100%);
        box-shadow: 0 6px 18px rgba(0,0,0,.35);
        opacity: .96;
        transition: transform .15s ease, opacity .15s ease;
      }
      #hmx-doc-btn:hover { transform: translateY(-1px); opacity: 1; }
      @media (max-width: 480px) { #hmx-doc-btn { font-size: 12px; padding: 7px 10px; } }
    `;
    document.head.appendChild(css);

    // Create button
    const a = document.createElement("a");
    a.id = "hmx-doc-btn";
    a.href = PDF;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "📘 Design Doc (PDF)";
    document.body.appendChild(a);
  });
})();
