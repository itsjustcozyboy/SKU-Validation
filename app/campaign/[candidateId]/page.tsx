// app/campaign/[candidateId]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { CandidateStorage, EventStorage, LeadStorage, SurveyStorage } from '@/lib/storage';

function useSessionId() {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    const existing = sessionStorage.getItem('sku_session_id');
    if (existing) {
      setSessionId(existing);
    } else {
      const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sku_session_id', newId);
      setSessionId(newId);
    }
  }, []);

  return sessionId;
}

function getUTMParams() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || 'direct',
    utmMedium: params.get('utm_medium') || 'organic',
    utmCampaign: params.get('utm_campaign') || '',
    utmContent: params.get('utm_content') || '',
    utmTerm: params.get('utm_term') || '',
  };
}

export default function CampaignPage({ params }: { params: { candidateId: string } }) {
  const candidateId = params.candidateId;
  const sessionId = useSessionId();
  const utm = getUTMParams();

  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [email, setEmail] = useState('');
  const [priceReaction, setPriceReaction] = useState<string | null>(null);
  const [surveyResponse, setSurveyResponse] = useState<any>({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    const c = CandidateStorage.getById(candidateId);
    setCandidate(c);
    setLoading(false);

    // Record page view
    if (sessionId && c) {
      EventStorage.save({
        id: `event_${Date.now()}`,
        skuCandidateId: candidateId,
        projectId: c.projectId,
        campaignId: `campaign_${candidateId}`,
        sessionId,
        eventType: 'page_view',
        utmSource: utm.utmSource,
        utmMedium: utm.utmMedium,
        utmCampaign: utm.utmCampaign,
        utmContent: utm.utmContent,
        utmTerm: utm.utmTerm,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      });
    }
  }, [candidateId, sessionId, utm]);

  useEffect(() => {
    const handleScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const depth = height > 0 ? (scrolled / height) * 100 : 0;
      setScrollDepth(Math.max(scrollDepth, depth));

      if (depth >= 50 && scrollDepth < 50) {
        EventStorage.save({
          id: `event_${Date.now()}`,
          skuCandidateId: candidateId,
          projectId: candidate?.projectId,
          campaignId: `campaign_${candidateId}`,
          sessionId,
          eventType: 'scroll_depth',
          eventValue: 50,
          timestamp: new Date().toISOString(),
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [candidateId, sessionId, candidate?.projectId, scrollDepth]);

  const handleCTAClick = () => {
    if (!sessionId || !candidate) return;

    EventStorage.save({
      id: `event_${Date.now()}`,
      skuCandidateId: candidateId,
      projectId: candidate.projectId,
      campaignId: `campaign_${candidateId}`,
      sessionId,
      eventType: 'hero_cta_click',
      eventValue: candidate.ctaText,
      timestamp: new Date().toISOString(),
    });

    alert('Thank you for your interest! We\'ll keep you updated on our launch.');
  };

  const handlePriceReaction = (reaction: string) => {
    if (!sessionId || !candidate) return;

    setPriceReaction(reaction);
    EventStorage.save({
      id: `event_${Date.now()}`,
      skuCandidateId: candidateId,
      projectId: candidate.projectId,
      campaignId: `campaign_${candidateId}`,
      sessionId,
      eventType: 'price_response',
      eventValue: reaction,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSurveyChange = (field: string, value: any) => {
    setSurveyResponse((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSurveySubmit = async () => {
    if (!sessionId || !candidate) return;
    setFormSubmitting(true);

    try {
      const survey = {
        id: `survey_${Date.now()}`,
        skuCandidateId: candidateId,
        projectId: candidate.projectId,
        campaignId: `campaign_${candidateId}`,
        sessionId,
        ...surveyResponse,
        createdAt: new Date().toISOString(),
      };

      SurveyStorage.save(survey);

      EventStorage.save({
        id: `event_${Date.now()}`,
        skuCandidateId: candidateId,
        projectId: candidate.projectId,
        campaignId: `campaign_${candidateId}`,
        sessionId,
        eventType: 'survey_submit',
        timestamp: new Date().toISOString(),
      });

      alert('Thank you for completing the survey!');
      setSurveyResponse({});
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId || !candidate) return;
    setFormSubmitting(true);

    try {
      const lead = {
        id: `lead_${Date.now()}`,
        skuCandidateId: candidateId,
        projectId: candidate.projectId,
        campaignId: `campaign_${candidateId}`,
        sessionId,
        email,
        consent: true,
        createdAt: new Date().toISOString(),
      };

      LeadStorage.save(lead);

      EventStorage.save({
        id: `event_${Date.now()}`,
        skuCandidateId: candidateId,
        projectId: candidate.projectId,
        campaignId: `campaign_${candidateId}`,
        sessionId,
        eventType: 'email_submit',
        eventValue: email,
        timestamp: new Date().toISOString(),
      });

      alert('Success! You\'ll receive launch updates at ' + email);
      setEmail('');
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading || !candidate) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Hero Section */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '3rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '1rem', fontWeight: '700' }}>
            {candidate.name}
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '2rem', lineHeight: '1.6' }}>
            {candidate.landingHeroCopy}
          </p>
          <div style={{ marginBottom: '2rem', backgroundColor: '#e5e7eb', borderRadius: '8px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
            제품 이미지 자리
          </div>
          <button
            onClick={handleCTAClick}
            style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
            className="btn-primary"
          >
            {candidate.ctaText}
          </button>
        </div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '700' }}>이 제품을 만든 이유</h2>
          <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '1rem' }}>
            많은 분들이 자신에게 맞는 스킨케어를 찾는 데 어려움을 겪고 있다는 점을 확인했습니다.
          </p>
          <p style={{ color: '#6b7280', lineHeight: '1.8' }}>
            {candidate.concept}
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section style={{ backgroundColor: '#f9fafb', padding: '3rem 2rem', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '700' }}>해결 방식</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>효과</h3>
              <p style={{ color: '#4b5563' }}>{candidate.benefit}</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>핵심 성분</h3>
              <p style={{ color: '#4b5563' }}>{candidate.ingredientConcept}</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>제형</h3>
              <p style={{ color: '#4b5563' }}>{candidate.formulaType}</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>포지셔닝</h3>
              <p style={{ color: '#4b5563' }}>{candidate.positioningMessage}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Price Reaction Section */}
      <section style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '700' }}>가격 검증</h2>
          <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
            <strong>추천 판매가: ${candidate.price}</strong>
          </p>
          <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>{candidate.priceTestQuestion}</p>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <button
              onClick={() => handlePriceReaction('Very Interested')}
              style={{
                padding: '1rem',
                border: priceReaction === 'Very Interested' ? '2px solid #3b82f6' : '1px solid #d1d5db',
                backgroundColor: priceReaction === 'Very Interested' ? '#eff6ff' : 'white',
              }}
              className="btn-secondary"
            >
              ✓ 매우 관심 있음
            </button>
            <button
              onClick={() => handlePriceReaction('Somewhat Interested')}
              style={{
                padding: '1rem',
                border: priceReaction === 'Somewhat Interested' ? '2px solid #3b82f6' : '1px solid #d1d5db',
                backgroundColor: priceReaction === 'Somewhat Interested' ? '#eff6ff' : 'white',
              }}
              className="btn-secondary"
            >
              ✓ 어느 정도 관심 있음
            </button>
            <button
              onClick={() => handlePriceReaction('Too Expensive')}
              style={{
                padding: '1rem',
                border: priceReaction === 'Too Expensive' ? '2px solid #ef4444' : '1px solid #d1d5db',
                backgroundColor: priceReaction === 'Too Expensive' ? '#fef2f2' : 'white',
              }}
              className="btn-secondary"
            >
              ✗ 너무 비쌈
            </button>
            <button
              onClick={() => handlePriceReaction('Not Interested')}
              style={{
                padding: '1rem',
                border: priceReaction === 'Not Interested' ? '2px solid #ef4444' : '1px solid #d1d5db',
                backgroundColor: priceReaction === 'Not Interested' ? '#fef2f2' : 'white',
              }}
              className="btn-secondary"
            >
              ✗ 관심 없음
            </button>
          </div>
        </div>
      </section>

      {/* Survey Section */}
      <section style={{ backgroundColor: '#f9fafb', padding: '3rem 2rem', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '700' }}>간단 설문</h2>

          <div className="form-group">
            <label className="form-label">피부 타입</label>
            <select
              value={surveyResponse.skinType || ''}
              onChange={e => handleSurveyChange('skinType', e.target.value)}
              className="form-control"
            >
              <option value="">선택하세요...</option>
              <option value="Dry">건성</option>
              <option value="Oily">지성</option>
              <option value="Combination">복합성</option>
              <option value="Sensitive">민감성</option>
              <option value="Normal">보통</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">가장 중요한 요소는?</label>
            <select
              value={surveyResponse.importantFactor || ''}
              onChange={e => handleSurveyChange('importantFactor', e.target.value)}
              className="form-control"
            >
              <option value="">선택하세요...</option>
              <option value="Ingredients">성분</option>
              <option value="Price">가격</option>
              <option value="Brand Trust">브랜드 신뢰</option>
              <option value="Reviews">후기</option>
              <option value="Packaging">패키징</option>
              <option value="Texture">텍스처</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">선호 구매 채널은?</label>
            <select
              value={surveyResponse.preferredChannel || ''}
              onChange={e => handleSurveyChange('preferredChannel', e.target.value)}
              className="form-control"
            >
              <option value="">선택하세요...</option>
              <option value="Amazon">아마존</option>
              <option value="TikTok Shop">틱톡 샵</option>
              <option value="Sephora">세포라</option>
              <option value="Brand Website">브랜드 웹사이트</option>
              <option value="Offline Store">오프라인 매장</option>
            </select>
          </div>

          {candidate.surveyQuestions && candidate.surveyQuestions.length > 0 && (
            <div className="form-group">
              <label className="form-label">{candidate.surveyQuestions[0]}</label>
              <textarea
                value={surveyResponse.customQ1 || ''}
                onChange={e => handleSurveyChange('customQ1', e.target.value)}
                className="form-control"
                rows={2}
                placeholder="답변을 입력하세요..."
              />
            </div>
          )}

          <button
            onClick={handleSurveySubmit}
            disabled={formSubmitting}
            style={{ width: '100%' }}
            className="btn-primary"
          >
            {formSubmitting ? '제출 중...' : '설문 제출'}
          </button>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '700' }}>출시 소식 받기</h2>
          <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
            이 제품이 출시되면 먼저 소식을 보내드립니다.
          </p>

          <form onSubmit={handleEmailSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="form-control"
              required
            />

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                required
                style={{ marginTop: '0.25rem', flexShrink: 0 }}
              />
              <span style={{ color: '#4b5563' }}>
                제품 소식 및 마케팅 안내 수신에 동의합니다
              </span>
            </label>

            <button
              type="submit"
              disabled={formSubmitting}
              style={{ width: '100%' }}
              className="btn-success"
            >
              {formSubmitting ? '제출 중...' : '소식 받기'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <section style={{ backgroundColor: '#f3f4f6', padding: '2rem', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: '1.6' }}>
            본 페이지는 출시 전 제품 컨셉에 대한 관심도 조사를 위한 페이지입니다. 현재 실제 판매 중인 제품이 아니며, 수집된 응답은 제품 기획 및 시장성 검증 목적으로만 활용됩니다.
          </p>
        </div>
      </section>
    </div>
  );
}
