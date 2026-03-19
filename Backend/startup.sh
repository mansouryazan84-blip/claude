#!/bin/bash
# ============================================================
# WMS System Startup Script
# ============================================================
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  WMS — Warehouse Management System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Step 1: Run database migration ──────────────────────────
echo ""
echo "📦 Step 1: Setting up database tables..."
mysql -h "${DB_HOST:-193.203.184.199}" \
      -u "${DB_USER:-u998106817_WHS}" \
      -p"${DB_PASSWORD:-Optimum2026@}" \
      "${DB_NAME:-u998106817_WHS}" \
      < "$(dirname "$0")/wms-backend/migration.sql" 2>&1 && \
  echo "   ✅ Database ready" || \
  echo "   ⚠️  Migration skipped (tables may already exist)"

# ── Step 2: Install backend deps ────────────────────────────
echo ""
echo "📦 Step 2: Installing backend dependencies..."
cd "$(dirname "$0")/wms-backend"
npm install --omit=dev
echo "   ✅ Backend dependencies installed"

# ── Step 3: Build backend ───────────────────────────────────
echo ""
echo "🔨 Step 3: Building backend..."
npm run build
echo "   ✅ Backend built"

# ── Step 4: Start backend ───────────────────────────────────
echo ""
echo "🚀 Step 4: Starting backend on port 3001..."
NODE_ENV=production node dist/main &
BACKEND_PID=$!
echo "   ✅ Backend started (PID: $BACKEND_PID)"

# ── Step 5: Serve frontend ──────────────────────────────────
echo ""
echo "🌐 Step 5: Frontend is built at wms-app/dist/"
echo "   Serve it with any static file server, e.g.:"
echo "   npx serve wms-app/dist -p 8080"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ WMS Backend running at http://0.0.0.0:3001"
echo "  🔑 Default login: admin@wms.sa / password"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

wait $BACKEND_PID
