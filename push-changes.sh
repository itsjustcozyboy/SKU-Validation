#!/bin/bash
set -e

cd /workspaces/SKU-Validation

echo "=== Git Status ==="
git status

echo ""
echo "=== Adding all changes ==="
git add -A

echo ""
echo "=== Committing changes ==="
git commit -m "refactor: restructure MVP to Pre-Production SKU Validation platform

- Remove 'brand' portal; establish clear 'admin' and 'customer' separation
- Redesign HomeGateway with hero section and two portal cards
- Restructure admin web with 4-step process (hypothesis → form → dashboard → report)
- Implement Toss-style admin dashboard with metric cards
- Add Demand Score (0-100), Production Risk, Launch Decision UI
- Implement launch decision thresholds (40/55/70 score points)
- Enhance report with 8 comprehensive sections
- Refactor customer web for pure D2C experience without admin metrics
- Update all translations (English & Korean)
- Fix AppStep type and clean up router logic"

echo ""
echo "=== Latest commit ==="
git log --oneline -1

echo ""
echo "=== Pushing to origin/main ==="
git push origin main

echo ""
echo "✅ Push complete!"
