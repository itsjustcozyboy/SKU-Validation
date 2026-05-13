// app/admin/sku-projects/[projectId]/candidates/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProjectStorage, CandidateStorage, EventStorage, LeadStorage, SurveyStorage } from '@/lib/storage';
import { calculateValidationScore } from '@/src/domain/scoring';

export default function CandidatesPage({ params }: { params: { projectId: string } }) {
  const projectId = params.projectId;
  const [project, setProject] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const proj = ProjectStorage.getById(projectId);
    const cands = CandidateStorage.getByProjectId(projectId);
    setProject(proj);
    setCandidates(cands);
    setLoading(false);
  }, [projectId]);

  const calculateMetrics = (candidateId: string) => {
    const events = EventStorage.getBySkuCandidateId(candidateId);
    const leads = LeadStorage.getBySkuCandidateId(candidateId);
    const surveys = SurveyStorage.getBySkuCandidateId(candidateId);

    const pageViews = events.filter(e => e.eventType === 'page_view').length;
    const ctaClicks = events.filter(e => e.eventType === 'hero_cta_click').length;
    const priceResponses = events.filter(e => e.eventType === 'price_response');
    const positivePrices = priceResponses.filter(e =>
      e.eventValue === 'Very Interested' || e.eventValue === 'Somewhat Interested'
    ).length;
    const timeEvents = events.filter(e => e.eventType === 'time_on_page');
    const avgTime =
      timeEvents.length > 0
        ? timeEvents.reduce((sum, e) => sum + (Number(e.eventValue) || 0), 0) / timeEvents.length
        : 0;
    const scrollEvents = events.filter(e => e.eventType === 'scroll_depth' && e.eventValue >= 50);
    const scroll50Rate = pageViews > 0 ? scrollEvents.length / pageViews : 0;

    return {
      visits: pageViews,
      ctaClicks,
      leads: leads.length,
      positivePriceResponses: positivePrices,
      totalPriceResponses: priceResponses.length,
      surveySubmits: surveys.length,
      avgTimeOnPageSec: avgTime,
      scroll50Rate,
    };
  };

  if (loading) {
    return <div className="container text-center mt-8"><div className="spinner"></div></div>;
  }

  if (!project) {
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
        <div className="container mt-8">
          <div className="alert alert-error">프로젝트를 찾을 수 없습니다</div>
        </div>
      </div>
    );
  }

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
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/admin">← 대시보드로 돌아가기</Link>
        </div>

        <h1 style={{ marginBottom: '0.5rem', fontSize: '1.875rem' }}>{project.name}</h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          {project.targetCountry} · {project.category} · {project.testGoal}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {candidates.map((candidate, idx) => {
            const metrics = calculateMetrics(candidate.id);
            const scoreResult = calculateValidationScore(metrics);

            return (
              <div key={candidate.id} className="card">
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>{idx + 1}. {candidate.name}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{candidate.concept}</p>
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                    <div>
                      <div style={{ color: '#6b7280' }}>가격</div>
                      <div style={{ fontWeight: '600' }}>${candidate.price}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280' }}>원가</div>
                      <div style={{ fontWeight: '600' }}>${candidate.cost}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280' }}>마진</div>
                      <div style={{ fontWeight: '600' }}>{(candidate.expectedMarginRate * 100).toFixed(0)}%</div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280' }}>채널</div>
                      <div style={{ fontWeight: '600' }}>{candidate.recommendedChannel}</div>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>핵심 특징</div>
                  <ul style={{ fontSize: '0.85rem', paddingLeft: '1rem', color: '#4b5563', lineHeight: '1.6' }}>
                    <li><strong>성분:</strong> {candidate.ingredientConcept}</li>
                    <li><strong>타입:</strong> {candidate.formulaType}</li>
                    <li><strong>효과:</strong> {candidate.benefit}</li>
                  </ul>
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>검증 데이터</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                    <div>
                      <div style={{ color: '#9ca3af' }}>방문 수</div>
                      <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{metrics.visits}</div>
                    </div>
                    <div>
                      <div style={{ color: '#9ca3af' }}>CTA 클릭</div>
                      <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{metrics.ctaClicks}</div>
                    </div>
                    <div>
                      <div style={{ color: '#9ca3af' }}>리드</div>
                      <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{metrics.leads}</div>
                    </div>
                    <div>
                      <div style={{ color: '#9ca3af' }}>설문</div>
                      <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{metrics.surveySubmits}</div>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>검증 점수</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.25rem' }}>
                    {scoreResult.score}/100
                  </div>
                  <div
                    className={`badge ${
                      scoreResult.score >= 80
                        ? 'badge-success'
                        : scoreResult.score >= 60
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}
                  >
                    {scoreResult.judgment}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link href={`/campaign/${candidate.id}`}>
                    <button style={{ width: '100%', marginBottom: '0.5rem' }} className="btn-primary">
                      랜딩 페이지 보기
                    </button>
                  </Link>
                  <Link href={`/admin/reports/${candidate.id}`}>
                    <button style={{ width: '100%' }} className="btn-secondary">
                      리포트 보기
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      const url = `/campaign/${candidate.id}?utm_source=meta&utm_medium=paid_social&utm_campaign=${projectId}&utm_content=test&utm_term=kbeauty`;
                      navigator.clipboard.writeText(`${window.location.origin}${url}`);
                      alert('광고 URL이 클립보드에 복사되었습니다!');
                    }}
                    style={{ width: '100%' }}
                    className="btn-secondary"
                  >
                    광고 URL 복사
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
