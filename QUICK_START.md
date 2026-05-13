# 🚀 K-Beauty SKU Validation MVP - 빠른 시작

## 현재 상태

localhost:3000에서 바로 사용할 수 있습니다.

## 웹 주소

- 홈: http://localhost:3000/
- SKU 생성기: http://localhost:3000/admin/sku-generator
- 대시보드: http://localhost:3000/admin
- 후보 비교: http://localhost:3000/admin/sku-projects/[projectId]/candidates
- 리포트: http://localhost:3000/admin/reports/[candidateId]
- 랜딩페이지: http://localhost:3000/campaign/[candidateId]

## 사용 방법

### 1. 기본 흐름
1. 홈에서 SKU 생성기로 이동합니다.
2. 타깃 국가, 카테고리, 키워드, 고객 문제를 입력합니다.
3. SKU 후보 생성 버튼을 누릅니다.
4. 3개 후보를 확인하고 비교합니다.
5. 랜딩페이지를 공유해 고객 반응을 수집합니다.
6. 대시보드와 리포트에서 검증 점수를 확인합니다.

### 2. 실제 Gemini API 사용
1. Google AI Studio에서 Gemini API 키를 발급받습니다.
2. `.env.local`의 `GEMINI_API_KEY`를 실제 키로 설정합니다.
3. `DEV_MOCK_GEMINI=false`로 둡니다.
4. 서버를 재시작합니다.

```bash
npm run dev
```

## 화면별 기능

- SKU 생성기: 프로젝트 정보 입력, 후보 3개 생성
- 후보 비교: 3개 SKU를 카드로 비교
- 랜딩페이지: 가격 반응, 설문, 이메일 수집
- 대시보드: KPI와 프로젝트 목록 확인
- 리포트: 검증 점수, 판단, 다음 행동 확인

## 검증 점수 해석

- 80점 이상: 출시 검토 가능
- 60~79점: 메시지/가격 조정 후 재검증
- 40~59점: 전반적인 수정 필요
- 40점 미만: 출시 보류

## 문제 해결

- 서버가 안 켜질 때: `npm run dev`를 다시 실행합니다.
- Gemini 오류가 날 때: `GEMINI_API_KEY`와 `DEV_MOCK_GEMINI`를 확인합니다.
- 결과가 영어로 보일 때: 생성기와 서버를 재시작합니다.

## 참고

- 데이터는 브라우저 localStorage에 저장됩니다.
- Meta Pixel은 `META_PIXEL_ID`를 설정한 뒤 연동할 수 있습니다.
- 배포 시에는 `npm run build` 후 `npm start`를 실행하면 됩니다.
