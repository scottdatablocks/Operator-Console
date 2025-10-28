# **Data Blocks | Harmonix Operator Console — Technical Design Specification (v9.0 Doctrine Edition)**

**Document Type:** Full Internal Engineering Specification
**Version:** 9.0 (Doctrine Edition)
**Date:** October 2025
**Maintainer:** Scott Redfern
**Environment:** Mac (Development) → Node001 (Production) → Cloudflare Edge
**Primary Domain:** `https://operator.data-blocks.ai/v9/`

---

## 1. Executive Summary

The Harmonix Operator Console is the mission-control interface for **Data Blocks' decentralized infrastructure**, enabling real-time observability, validation, and orchestration across Akash provider nodes.
Version 9 introduces the **Doctrine Edition**, aligned with the *Harmonix Operator Console Doctrine* — embedding Theory of Constraints (TOC), Golden Build Flow, Validation Framework, and Learning System principles.
This document defines every component, command, file path, and architectural behavior supporting v9 deployment at `Node001`.

---

## 2. System Overview

The console unifies local and remote operator activities through:

* **Frontend:** React + Vite + Tailwind + ShadCN stack.
* **Backend:** Nginx reverse proxy → static build served from `/var/www/operator-console/v9`.
* **Edge Delivery:** Cloudflare CDN caching assets and providing TLS termination.
* **Runtime Integration:** Harmonix Preflight Validator and Installer subsystems on Node001.
* **Environment Linkage:**

  * Mac → build + push
  * Node001 → host + Nginx serve
  * Cloudflare → cache + distribute

Primary asset root:

```
/var/www/operator-console/v9/
├── index.html
├── assets/
│   ├── js/app_v9.js
│   ├── css/app_v9.css
│   ├── img/
│   └── manifest.json
```

---

## 3. Architecture Diagram

```
                ┌──────────────────────────────────────────────┐
                │             Mac (Development)                │
                │  Vite → React → Tailwind → ShadCN Build      │
                │  npm run build → deploy_v9.sh → rsync/scp     │
                └──────────────────────┬───────────────────────┘
                                       │
                           SSH / Secure Copy
                                       │
                ┌──────────────────────────────────────────────┐
                │           Node001 (HostDime Orlando)         │
                │ /var/www/operator-console/v9/                │
                │ Nginx reverse proxy → 443                    │
                │ Preflight: /root/harmonix/preflight_v9.2.sh  │
                │ Installer: /root/harmonix/installer_v9.2.sh  │
                │ Runtime:  Harmonix Observer + Ledger         │
                └──────────────────────┬───────────────────────┘
                                       │
                           HTTPS via Cloudflare Edge
                                       │
                ┌──────────────────────────────────────────────┐
                │        operator.data-blocks.ai (CDN)         │
                │ Cached assets + TLS + DDoS protection         │
                └──────────────────────────────────────────────┘
```

---

## 4. Core Modules & Components

### 4.1 Preflight Validator

* **Script:** `/root/harmonix/preflight_v9.2.sh`
* **Purpose:** Run system-wide validation before any deployment or upgrade.
* **Checks:**

  * Nginx syntax: `sudo nginx -t`
  * JS asset existence: `/var/www/operator-console/v9/assets/js/app_v9.js`
  * Cloudflare edge cache status:
    `curl -sI https://operator.data-blocks.ai/v9/assets/js/app_v9.js | grep -Ei "HTTP|cf-cache-status|server"`
  * Permissions and ownership under `/var/www/`
  * Log output: `/root/harmonix/logs/preflight_v9.log`
* **Exit Codes:**

  * `0` = clean
  * `1` = validation failure
  * `2` = Cloudflare cache mismatch

### 4.2 Harmonix Installer

* **Script:** `/root/harmonix/installer_v9.2.sh`
* **Purpose:** Handles atomic deployment, rollback, and promotion.
* **Workflow:**

  1. Verify preflight completion.
  2. Clear `/var/www/operator-console/v9/*` except `assets/img/`.
  3. Copy new build via `scp` or `rsync` from Mac.
  4. Purge Cloudflare cache using API key.
  5. Reload Nginx: `sudo systemctl reload nginx`.
  6. Record build hash in `/root/harmonix/ledger/build_v9.log`.
* **Trigger:** manual via CLI or CI/CD webhook.

### 4.3 Harmonix Observer

Runtime daemon monitoring console uptime and asset validity.

* Binary: `/root/harmonix/hmx_observer.sh`
* Polls:

  * `app_v9.js` and `index.html` checksum every 5 min.
  * Nginx status.
  * Logs anomalies to `/root/harmonix/ledger/runtime_v9.log`.

### 4.4 Harmonix Ledger

Immutable record of build, preflight, and runtime events.

* Located under `/root/harmonix/ledger/`
* Example entries:

  ```
  [2025-10-28T11:35Z] PRE: nginx syntax OK, Cloudflare HIT, status 200
  [2025-10-28T11:36Z] DEPLOY: app_v9.js checksum 45f1 OK
  [2025-10-28T11:37Z] OBSERVER: runtime stable 5m check
  ```

---

## 5. Operator Console Frontend

### 5.1 Framework Stack

* **Build Tool:** Vite 5.x
* **Framework:** React 18.3.1
* **Styling:** Tailwind CSS + ShadCN UI components
* **Routing:** React Router DOM v6
* **Animations:** Framer Motion
* **Fonts:** Inter, Space Grotesk
* **Build Command:** `npm run build`
* **Output Directory:** `dist/` → uploaded to `/var/www/operator-console/v9/`

### 5.2 Routing Map

```
/
├── /overview
├── /nodes
├── /events
├── /preflight
├── /installer
├── /logs
└── /about
```

Each page references centralized layout `Layout.jsx`, imported through:

```jsx
import Layout from "@/layout/Layout"
```

### 5.3 State & API Architecture

* State handled via React Context and local reducers.
* All API calls proxied through relative paths (`/api/...`) served by Nginx rewrites if needed.
* Websocket hooks planned for v10 (Harmonix Runtime Feed).

### 5.4 Assets & Version Control

* JS: `/v9/assets/js/app_v9.js`
* CSS: `/v9/assets/css/app_v9.css`
* Each build stamped with unique hash logged in `build_v9.log`.

---

## 6. Backend Integration

### 6.1 Nginx

Config snippet:

```nginx
server {
  listen 443 ssl;
  server_name operator.data-blocks.ai;

  root /var/www/operator-console/v9;
  index index.html;

  location /v9/ {
    alias /var/www/operator-console/v9/;
    try_files $uri /v9/index.html;
  }

  ssl_certificate /etc/letsencrypt/live/data-blocks.ai/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/data-blocks.ai/privkey.pem;
}
```

### 6.2 Cloudflare Edge

* Full (strict) SSL mode.
* Cache TTL: 1 hour.
* Automatic purge triggered post-deploy via Cloudflare API:

  ```
  curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
  ```

### 6.3 CI/CD Pipeline

* Source repo: `https://github.com/scottdatablocks/Operator-Console`
* Deploy script: `deploy_v9.sh`
* Command:

  ```bash
  npm run build
  scp -r dist/* root@138.128.186.74:/var/www/operator-console/v9/
  ssh root@138.128.186.74 "sudo /root/harmonix/installer_v9.2.sh"
  ```
* GitHub Action triggers Cloudflare purge after commit to `main`.

---

## 7. Harmonix Doctrine Alignment

### 7.1 TOC-Based Development

* Every iteration resolves top constraint (e.g., DNS, asset cache, ingress).
* Each Cross-Constraint Event (CCE) updates doctrine notes.
* Console designed as *constraint visibility surface* for operators.

### 7.2 Golden Build Flow

Applied lifecycle:
**Define → Build → Align → Deploy → Verify → Promote → Record**

v9.0 implements through:

* `preflight_v9.2.sh` → Verify
* `installer_v9.2.sh` → Deploy + Promote
* `ledger/` → Record

### 7.3 Validation Framework

* Ensures every operator command passes:

  * Syntax check
  * Asset presence
  * Edge status
* Prevents partial or ghost deployments.

### 7.4 Learning System

Each deployment produces:
`/root/harmonix/ledger/learning_v9.md` capturing root cause analyses and corrective actions.

---

## 8. Security & Validation Rules

* No direct write access to `/var/www/` except installer.
* All Harmonix scripts owned by `root:root`, `chmod 700`.
* Cloudflare API tokens restricted to purge endpoint.
* TLS auto-renewed via Certbot cron.
* Validation checks enforce:

  * File ownership `www-data:www-data`
  * JS integrity checksum
  * Log tail consistency

---

## 9. Deployment & Update Lifecycle

1. Build on Mac: `npm run build`
2. Push via `deploy_v9.sh`
3. Run on Node001:

   ```bash
   sudo /root/harmonix/preflight_v9.2.sh
   sudo /root/harmonix/installer_v9.2.sh
   ```
4. Validate Cloudflare cache status.
5. Confirm via:

   ```bash
   curl -sI https://operator.data-blocks.ai/v9/assets/js/app_v9.js | grep -i cf-cache-status
   ```
6. Log event in Ledger.
7. Observer auto-validates after 5 minutes.

---

## 10. Future Roadmap

| Version | Focus Area                           | Description                                                    |
| ------- | ------------------------------------ | -------------------------------------------------------------- |
| v10.0   | **Real-time Observer Feed**          | WebSocket streaming of runtime metrics from Harmonix Observer. |
| v10.1   | **Installer Web UI**                 | Visual install monitor with rollback and diff comparison.      |
| v11.0   | **Federation Layer**                 | Manage multiple providers via unified console.                 |
| v12.0   | **SaaS Deployment (Harmonix Cloud)** | Hosted control panel for external Akash providers.             |

---

## Appendix A — Environment Matrix

| Layer   | Host           | Function        | Key Paths                                          |
| ------- | -------------- | --------------- | -------------------------------------------------- |
| Dev     | Mac            | Build + Push    | `~/Projects/operator-console`                      |
| Node001 | 138.128.186.74 | Serve + Runtime | `/var/www/operator-console/v9/`, `/root/harmonix/` |
| Edge    | Cloudflare     | CDN/TLS         | Global POPs                                        |

---

## Appendix B — Version Table

| Component          | Version   | Path                               |
| ------------------ | --------- | ---------------------------------- |
| Vite               | 5.0.12    | `package.json`                     |
| React              | 18.3.1    | `src/`                             |
| Tailwind           | 3.4.4     | `tailwind.config.js`               |
| Nginx              | 1.24.0    | `/etc/nginx/nginx.conf`            |
| Ubuntu             | 22.04 LTS | Node001                            |
| Harmonix Preflight | v9.2      | `/root/harmonix/preflight_v9.2.sh` |
| Harmonix Installer | v9.2      | `/root/harmonix/installer_v9.2.sh` |
| Cloudflare         | Edge 2025 | Managed Zone                       |

---

**End of Document**
*Data Blocks LLC — Internal Engineering Specification (Harmonix Operator Console v9.0 Doctrine Edition)*
