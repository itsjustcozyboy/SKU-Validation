# K-Beauty SKU Validation MVP

Gemini AI로 K-Beauty SKU 후보를 만들고, 고객 반응을 수집해 출시 가능성을 검증하는 MVP입니다.

## 현재 상태

- [x] 기획 및 아키텍처 정리
- [x] 도메인 모델과 검증 점수 정의
- [x] 샘플 데이터 시드 구성
- [x] 관리자 화면, 후보 비교 화면, 캠페인 랜딩페이지 구현
- [x] 이벤트 수집 API와 localStorage 저장소 구현
- [x] 대시보드와 리포트 페이지 구현
- [x] Gemini API 실제 연동 및 mock fallback 구성

## 시작하기

### 1. 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`를 `.env.local`로 복사한 뒤 Gemini API 키를 넣어주세요.

```bash
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
DEV_MOCK_GEMINI=false
META_PIXEL_ID=
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 됩니다.

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 주요 기능

### 관리자 대시보드 `/admin`
- 프로젝트와 SKU 후보 현황 확인
- 방문, 리드, 설문, CTA 클릭 KPI 확인
- 검증 점수와 리포트 빠른 이동

### SKU 생성기 `/admin/sku-generator`
- 국가, 카테고리, 키워드, 타깃 고객, 문제, 가격대 입력
- Gemini API로 3개 SKU 콘셉트 생성
- 자동으로 프로젝트와 후보 저장
- 개발용 mock fallback 지원

### 후보 비교 `/admin/sku-projects/:projectId/candidates`
- 3개 후보를 한 화면에서 비교
- 방문, CTA, 리드, 설문 지표 표시
- 검증 점수와 판단 결과 표시
- 랜딩페이지 및 리포트 바로 이동

### 캠페인 랜딩페이지 `/campaign/:candidateId`
- 모바일 우선 랜딩페이지
- 가격 반응, 설문, 이메일 리드 수집
- 스크롤 깊이와 체류 시간 추적
- UTM 파라미터 보존

### 검증 점수

총점 100점 기준:
- CTA 클릭률 25점
- 이메일 리드율 25점
- 긍정적 가격 반응 20점
- 설문 제출율 10점
- 평균 체류 시간 10점
- 50% 이상 스크롤 10점

판단 기준:
- 80점 이상: 출시 검토 가능
- 60~79점: 메시지/가격 조정 후 재검증
- 40~59점: 대대적인 수정 필요
- 40점 미만: 출시 보류

### 리포트 `/admin/reports/:candidateId`
- SKU별 성과 분석
- 참여도와 전환 지표 요약
- 가격 반응 요약
- 다음 행동 추천

## 데이터 저장

- 브라우저 localStorage에 저장
- 새로고침 후에도 데이터 유지
- 추후 Firebase, PostgreSQL 등으로 확장 가능

## Gemini API

### 프롬프트 전략
- K-Beauty 제품 기획자와 글로벌 D2C 전략가 역할을 부여
- 서로 다른 3개 콘셉트를 생성하도록 유도
- 화장품 표현 안전 수칙을 포함
- 랜딩페이지용 카피와 CTA를 함께 생성
- JSON만 반환하도록 강제

### 안전한 표현

- 금지: 치료, 완치, 보장, FDA 승인 등 의료적 표현
- 권장: 산뜻한 사용감, 촉촉한 마무리, 데일리 케어, 민감 피부에 순한 느낌

### fallback

- `DEV_MOCK_GEMINI=true`이면 mock 후보를 사용
- API 키가 없으면 명확한 오류 메시지 표시
- Gemini 오류 발생 시 mock 후보로 자동 전환

## API 엔드포인트

- `POST /api/generate-skus` - SKU 후보 3개 생성
- `POST /api/events` - 고객 행동 이벤트 저장
- `POST /api/leads` - 이메일 리드 저장
- `POST /api/surveys` - 설문 응답 저장

## 기술 스택

- Next.js 14
- React 18
- TypeScript
- Google Generative AI (Gemini)
- localStorage 기반 저장소
- Vercel 배포 가능

## 캠페인 페이지 안내 문구

본 페이지는 출시 전 제품 콘셉트에 대한 관심도 조사를 위한 페이지입니다. 현재 실제 판매 중인 제품이 아니며, 수집된 응답은 제품 기획 및 시장성 검증 목적으로만 활용됩니다.
