// Harmonix Operator Console — v8 initialization shim
console.log("Harmonix v8 app_v8.js loaded");

async function hmxBoot() {
  console.log("Harmonix v8 boot sequence starting...");

  try {
    // Load dashboard metrics
    if (typeof updateDashboard === "function") {
      await updateDashboard();
      console.log("Dashboard metrics updated.");
    }

    // Load pods view if defined
    if (typeof renderPods === "function") {
      await renderPods();
      console.log("Pods grid rendered.");
    }

    // Load theatre if available
    if (typeof renderTheatre === "function") {
      await renderTheatre();
      console.log("Theatre animation loaded.");
    }
  } catch (err) {
    console.error("Harmonix boot error:", err);
  }
}

// Run boot once DOM is ready
document.addEventListener("DOMContentLoaded", hmxBoot);
