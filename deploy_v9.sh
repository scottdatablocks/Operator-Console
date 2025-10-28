#!/usr/bin/env bash
set -euo pipefail

NODE_HOST="138.128.186.74"
NODE_USER="root"
VER="v9"
DIST_DIR="$(pwd)/dist"

echo "------------------------------------------------------"
echo "🚀 [1/5] Building Harmonix Operator Console v9..."
echo "------------------------------------------------------"

if ! grep -q "base:[[:space:]]*'/v9/'" vite.config.js; then
  echo "[WARN] vite.config.js base not '/v9/'"
fi

npm ci
npm run build

echo "------------------------------------------------------"
echo "📦 [2/5] Uploading build to Node001..."
echo "------------------------------------------------------"
scp -r "${DIST_DIR}/"* "${NODE_USER}@${NODE_HOST}:/var/www/operator-console/${VER}/"

echo "------------------------------------------------------"
echo "🔧 [3/5] Reloading Nginx & validating..."
echo "------------------------------------------------------"
ssh -o StrictHostKeyChecking=no "${NODE_USER}@${NODE_HOST}" bash -s <<'REMOTE'
set -euo pipefail
VER="v9"
sudo chown -R www-data:www-data "/var/www/operator-console/${VER}"
sudo chmod -R 755 "/var/www/operator-console/${VER}"
sudo nginx -t
sudo systemctl reload nginx
/usr/local/bin/validate_console.sh "${VER}"
/usr/local/bin/hmx_cf_purge.sh "${VER}" || true
REMOTE

echo "------------------------------------------------------"
echo "🧾 [4/5] Syncing audit manifest..."
echo "------------------------------------------------------"
ssh "${NODE_USER}@${NODE_HOST}" "/usr/local/bin/hmx_audit_sync.sh v9" || true

echo "------------------------------------------------------"
echo "✅ [5/5] Deployment complete! Visit:"
echo "   https://operator.data-blocks.ai/v9/"
echo "------------------------------------------------------"

