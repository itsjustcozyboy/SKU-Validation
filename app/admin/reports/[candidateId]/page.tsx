// app/admin/reports/[candidateId]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CandidateStorage, ProjectStorage, EventStorage, LeadStorage, SurveyStorage } from '@/lib/storage';
import { calculateValidationScore } from '@/src/domain/scoring';

export default function ReportPage({ params }: { params: { candidateId: string } }) {
  const candidateId = params.candidateId;
  const [candidate, setCandidate] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [scoreResult, setScoreResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cand = CandidateStorage.getById(candidateId);
    if (cand) {
      setCandidate(cand);
      const proj = ProjectStorage.getById(cand.projectId);
      setProject(proj);

      // Calculate metrics
      const allEvents = EventStorage.getAll();
      const allLeads = LeadStorage.getAll();
      const allSurveys = SurveyStorage.getAll();

      const events = allEvents.filter(e => e.skuCandidateId === candidateId);
      const leads = allLeads.filter(l => l.skuCandidateId === candidateId);
      const surveys = allSurveys.filter(s => s.skuCandidateId === candidateId);

      const pageViews = events.filter(e => e.eventType === 'page_view').length;
      const ctaClicks = events.filter(e => e.eventType === 'hero_cta_click').length;
      const priceResponses = events.filter(e => e.eventType === 'price_response');
      const positivePrices = priceResponses.filter(
        e => e.eventValue === 'Very Interested' || e.eventValue === 'Somewhat Interested'
      ).length;
      const timeEvents = events.filter(e => e.eventType === 'time_on_page');
      const avgTime =
        timeEvents.length > 0
          ? timeEvents.reduce((sum, e) => sum + (Number(e.eventValue) || 0), 0) / timeEvents.length
          : 0;
      const scrollEvents = events.filter(e => e.eventType === 'scroll_depth' && e.eventValue >= 50);
      const scroll50Rate = pageViews > 0 ? scrollEvents.length / pageViews : 0;

      const metricsData = {
        visits: pageViews,
        ctaClicks,
        leads: leads.length,
        positivePriceResponses: positivePrices,
        totalPriceResponses: priceResponses.length,
        surveySubmits: surveys.length,
        avgTimeOnPageSec: avgTime,
        scroll50Rate,
      };

      setMetrics(metricsData);
      setScoreResult(calculateValidationScore(metricsData));
    }
    setLoading(false);
  }, [candidateId]);

  if (loading) {
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
        <div className="container text-center mt-8">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!candidate || !project || !metrics || !scoreResult) {
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
          <div className="alert alert-error">리포트를 찾을 수 없습니다.</div>
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

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>{candidate.name}</h1>
          <p style={{ color: '#6b7280' }}>
            {project.name} · {project.targetCountry} · {project.category}
          </p>
        </div>

        {/* Score Summary */}
        <div className="card" style={{ marginBottom: '2rem', backgroundColor: '#f0f9ff', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>검증 점수</div>
              <div style={{ fontSize: '3rem', fontWeight: '700', color: '#1f2937' }}>{scoreResult.score}/100</div>
              <div
                className={`badge ${
                  scoreResult.score >= 80
                    ? 'badge-success'
                    : scoreResult.score >= 60
                    ? 'badge-warning'
                    : scoreResult.score >= 40
                    ? 'badge-danger'
                    : 'badge-danger'
                }`}
                style={{ marginTop: '0.5rem' }}
              >
                {scoreResult.judgment}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>점수 세부 내역</div>
              <div style={{ fontSize: '0.85rem', lineHeight: '1.8' }}>
                <div>CTA 비율: {scoreResult.breakdown.cta.toFixed(1)}/25</div>
                <div>리드 비율: {scoreResult.breakdown.lead.toFixed(1)}/25</div>
                <div>가격 반응: {scoreResult.breakdown.price.toFixed(1)}/20</div>
                <div>설문 비율: {scoreResult.breakdown.survey.toFixed(1)}/10</div>
                <div>페이지 체류 시간: {scoreResult.breakdown.time.toFixed(1)}/10</div>
                <div>스크롤 깊이: {scoreResult.breakdown.scroll.toFixed(1)}/10</div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>SKU 상세</h3>
            <div style={{ display: 'grid', gap: '1rem', fontSize: '0.95rem' }}>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>이름</div>
                <div style={{ fontWeight: '600' }}>{candidate.name}</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>카테고리</div>
                <div style={{ fontWeight: '600' }}>{candidate.category}</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>타깃 국가</div>
                <div style={{ fontWeight: '600' }}>{candidate.targetCountry}</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>제형</div>
                <div style={{ fontWeight: '600' }}>{candidate.formulaType}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>가격 정보</h3>
            <div style={{ display: 'grid', gap: '1rem', fontSize: '0.95rem' }}>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>판매 가격</div>
                <div style={{ fontWeight: '600' }}>${candidate.price}</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>원가</div>
                <div style={{ fontWeight: '600' }}>${candidate.cost}</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>마진율</div>
                <div style={{ fontWeight: '600' }}>{(candidate.expectedMarginRate * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Concept & Messaging */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>콘셉트 및 메시지</h3>
          <div style={{ display: 'grid', gap: '1.5rem', fontSize: '0.95rem' }}>
            <div>
              <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>콘셉트</div>
              <p style={{ lineHeight: '1.6' }}>{candidate.concept}</p>
            </div>
            <div>
              <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>포지셔닝</div>
              <p style={{ lineHeight: '1.6' }}>{candidate.positioningMessage}</p>
            </div>
            <div>
              <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>광고 헤드라인</div>
              <p style={{ lineHeight: '1.6', fontWeight: '600' }}>{candidate.adHeadline}</p>
            </div>
            <div>
              <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>성분 콘셉트</div>
              <p style={{ lineHeight: '1.6' }}>{candidate.ingredientConcept}</p>
            </div>
          </div>
        </div>

        {/* Customer Data */}
        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>참여 지표</h3>
            <div style={{ display: 'grid', gap: '1rem', fontSize: '0.95rem' }}>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>전체 방문 수</div>
                <div style={{ fontWeight: '600', fontSize: '1.5rem' }}>{metrics.visits}</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>CTA 클릭 수</div>
                <div style={{ fontWeight: '600', fontSize: '1.5rem' }}>
                  {metrics.ctaClicks} ({metrics.visits > 0 ? ((metrics.ctaClicks / metrics.visits) * 100).toFixed(1) : 0}%)
                </div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>평균 체류 시간</div>
                <div style={{ fontWeight: '600', fontSize: '1.5rem' }}>{metrics.avgTimeOnPageSec.toFixed(0)}s</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>50% 이상 스크롤</div>
                <div style={{ fontWeight: '600', fontSize: '1.5rem' }}>
                  {(metrics.scroll50Rate * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>전환 지표</h3>
            <div style={{ display: 'grid', gap: '1rem', fontSize: '0.95rem' }}>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>전체 리드</div>
                <div style={{ fontWeight: '600', fontSize: '1.5rem' }}>
                  {metrics.leads} ({metrics.visits > 0 ? ((metrics.leads / metrics.visits) * 100).toFixed(1) : 0}%)
                </div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>설문 응답</div>
                <div style={{ fontWeight: '600', fontSize: '1.5rem' }}>
                  {metrics.surveySubmits} ({metrics.visits > 0 ? ((metrics.surveySubmits / metrics.visits) * 100).toFixed(1) : 0}%)
                </div>
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>긍정적 가격 반응</div>
                <div style={{ fontWeight: '600', fontSize: '1.5rem' }}>
                  {metrics.positivePriceResponses} (
                  {metrics.totalPriceResponses > 0
                    ? ((metrics.positivePriceResponses / metrics.totalPriceResponses) * 100).toFixed(0)
                    : 0}
                  %)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="card" style={{ marginBottom: '2rem', backgroundColor: '#f0fdf4', borderLeft: '4px solid #10b981' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>최종 평가</h3>
          <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
            <strong>상태:</strong> {scoreResult.judgment}
          </p>
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {scoreResult.score >= 80
                ? '이 SKU는 시장성이 높아 자신 있게 출시 검토를 진행할 수 있습니다.'
                : scoreResult.score >= 60
                ? '이 SKU는 가능성은 있지만 중간 수준입니다. 출시 전 메시지, 가격, 타깃을 조정해 보세요.'
                : scoreResult.score >= 40
                ? '이 SKU는 상당한 보완이 필요합니다. 타깃 시장, 포지셔닝, 가격 전략을 다시 검토하세요.'
                : '이 SKU는 근본적인 재검토가 필요합니다. 콘셉트를 전환하거나 출시를 미루는 것을 고려하세요.'}
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>추천 다음 단계</h3>
          <ol style={{ paddingLeft: '1.5rem', color: '#4b5563', lineHeight: '1.8' }}>
            {scoreResult.score >= 80 ? (
              <>
                <li>제조 및 공급망 준비를 진행합니다</li>
                <li>검증된 메시지로 본격 캠페인을 준비합니다</li>
                <li>제품 패키징과 마케팅 자료를 기획합니다</li>
                <li>리테일 파트너십 또는 이커머스 채널을 구축합니다</li>
              </>
            ) : scoreResult.score >= 60 ? (
              <>
                <li>상위 설문 피드백을 분석해 메시지 인사이트를 도출합니다</li>
                <li>새로운 타깃층으로 대체 가격대를 테스트합니다</li>
                <li>고객 피드백을 바탕으로 제품 포지셔닝을 다듬습니다</li>
                <li>수정된 소재로 2차 검증 테스트를 진행합니다</li>
              </>
            ) : scoreResult.score >= 40 ? (
              <>
                <li>더 깊은 고객 인터뷰 조사를 진행합니다</li>
                <li>타깃 고객 세그먼트를 전면 재검토합니다</li>
                <li>포지셔닝 변경 또는 제품 재구성을 고려합니다</li>
                <li>다른 마케팅 메시지 접근으로 테스트합니다</li>
              </>
            ) : (
              <>
                <li>근본 검토 전까지 제품 출시는 보류합니다</li>
                <li>대체 사용 시나리오나 타깃 시장을 탐색합니다</li>
                <li>이 SKU가 브랜드 전략과 맞는지 검토합니다</li>
                <li>같은 타깃으로 전혀 다른 콘셉트를 테스트합니다</li>
              </>
            )}
          </ol>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href="/admin">
            <button className="btn-secondary">↑ 대시보드로 돌아가기</button>
          </Link>
        </div>
      </main>
    </div>
  );
}
