# K-Beauty SKU Validation MVP

This repository bootstraps the **K-Beauty SKU Validation MVP**.

## MVP Goal

"K-Beauty brands input keywords, generate 3 SKU candidates, launch candidate landing pages, collect ad-response behavior data, and recommend the most marketable SKU."

## Current Status

- [x] Product architecture and implementation plan
- [x] Domain schemas and scoring spec
- [x] Mock seed dataset (project + 3 candidates + campaign/events/leads/surveys)
- [ ] UI implementation (admin generator, candidates comparison, campaign landing)
- [ ] Event collector endpoints
- [ ] Dashboard/report pages
- [ ] LLM provider integration

## Planned Routes

- `/admin/dashboard`
- `/admin/sku-generator`
- `/admin/sku-projects`
- `/admin/sku-projects/:projectId`
- `/admin/sku-projects/:projectId/candidates`
- `/admin/candidates/:skuCandidateId/edit`
- `/admin/campaigns/:campaignId`
- `/admin/reports/:skuCandidateId`
- `/campaign/:skuCandidateId`

## Safety Copy Rule (Cosmetic Claims)

Disallow: treatment/cure/medical-improvement/guaranteed outcomes/FDA-like claims.

Use safe wording like: lightweight texture, fresh finish, daily care, gentle concept for sensitive skin, hydration-focused routine.

## Disclaimer (must appear on campaign pages)

"본 페이지는 출시 전 제품 컨셉에 대한 관심도 조사를 위한 페이지입니다. 현재 실제 판매 중인 제품이 아니며, 수집된 응답은 제품 기획 및 시장성 검증 목적으로만 활용됩니다."
