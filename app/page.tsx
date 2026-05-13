// app/page.tsx

'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <header className="header">
        <div className="header-content">
          <div className="logo">K-Beauty SKU Validation</div>
          <nav className="nav">
            <Link href="/admin/sku-generator">생성기</Link>
            <Link href="/admin">대시보드</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="mt-8">
          <div className="card text-center">
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              K-Beauty SKU 검증 MVP
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '2rem' }}>
              Gemini AI와 실제 고객 피드백으로 SKU 후보를 검증합니다
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/admin/sku-generator">
                <button className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 1.5rem' }}>
                  SKU 생성 시작
                </button>
              </Link>
              <Link href="/admin">
                <button className="btn-secondary" style={{ fontSize: '1rem', padding: '0.875rem 1.5rem' }}>
                  대시보드 보기
                </button>
              </Link>
            </div>
          </div>

          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card">
              <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>⚡ 생성</h3>
              <p style={{ color: '#6b7280' }}>
                키워드와 요구사항을 입력하면 Gemini AI가 3개의 서로 다른 SKU 콘셉트를 즉시 생성합니다.
              </p>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🧪 테스트</h3>
              <p style={{ color: '#6b7280' }}>
                각 SKU마다 랜딩 페이지를 만들고 고객에게 공유해 반응과 데이터를 수집합니다.
              </p>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: '1rem', color: '#f59e0b' }}>📊 검증</h3>
              <p style={{ color: '#6b7280' }}>
                참여도, 리드, 가격 수용도를 측정하고 검증 점수와 출시 권고를 확인합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem' }}>작동 방식</h2>
            <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.8', color: '#4b5563' }}>
              <li>브랜드 정보와 타깃 시장을 입력해 SKU 생성 폼을 작성합니다</li>
              <li>Gemini AI가 3개의 고유한 제품 후보를 생성합니다</li>
              <li>대시보드에서 후보를 검토하고 비교합니다</li>
              <li>랜딩 페이지를 생성해 고객에게 공유합니다</li>
              <li>설문과 CTA를 통해 고객 피드백을 수집합니다</li>
              <li>시장성을 보여주는 검증 점수를 확인합니다</li>
              <li>근거 있는 출시 결정을 내립니다</li>
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
}
