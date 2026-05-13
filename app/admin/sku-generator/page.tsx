// app/admin/sku-generator/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProjectStorage, CandidateStorage, CampaignStorage } from '@/lib/storage';
import { GeminiResponse } from '@/lib/gemini';

interface FormData {
  targetCountry: string;
  category: string;
  inputKeywords: string;
  targetCustomer: string;
  customerProblem: string;
  priceRange: string;
  costRange: string;
  channel: string;
  brandTone: string;
  testGoal: string;
}

export default function SKUGenerator() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    targetCountry: 'US',
    category: 'Skincare',
    inputKeywords: '',
    targetCustomer: '',
    customerProblem: '',
    priceRange: '',
    costRange: '',
    channel: 'Amazon',
    brandTone: 'Clean Beauty',
    testGoal: 'Concept Validation',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.inputKeywords.trim()) {
        throw new Error('Please enter core keywords');
      }
      if (!formData.targetCustomer.trim()) {
        throw new Error('Please describe your target customer');
      }
      if (!formData.customerProblem.trim()) {
        throw new Error('Please describe the customer problem');
      }

      // Call Gemini API
      const response = await fetch('/api/generate-skus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to generate SKU candidates');
      }

      const geminiData: GeminiResponse = await response.json();

      // Save project
      const projectId = `project_${Date.now()}`;
      const project = {
        id: projectId,
        name: geminiData.project.name,
        targetCountry: geminiData.project.targetCountry,
        category: geminiData.project.category,
        inputKeywords: geminiData.project.inputKeywords.split(',').map(k => k.trim()),
        targetCustomer: geminiData.project.targetCustomer,
        customerProblem: geminiData.project.customerProblem,
        priceRange: geminiData.project.priceRange,
        costRange: geminiData.project.costRange,
        channel: [geminiData.project.channel],
        brandTone: geminiData.project.brandTone,
        testGoal: [geminiData.project.testGoal],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      ProjectStorage.save(project);

      // Save candidates and campaigns
      geminiData.candidates.forEach((candidateData, index) => {
        const candidateId = `candidate_${projectId}_${index + 1}`;
        const candidate = {
          id: candidateId,
          projectId,
          name: candidateData.name,
          category: candidateData.category,
          targetCountry: candidateData.targetCountry,
          targetCustomer: candidateData.targetCustomer,
          concept: candidateData.concept,
          ingredientConcept: candidateData.ingredientConcept,
          formulaType: candidateData.formulaType,
          price: candidateData.price,
          cost: candidateData.cost,
          expectedMarginRate: candidateData.expectedMarginRate,
          benefit: candidateData.benefit,
          positioningMessage: candidateData.positioningMessage,
          adHeadline: candidateData.adHeadline,
          adSubCopy: candidateData.adSubCopy,
          landingHeroCopy: candidateData.landingHeroCopy,
          ctaText: candidateData.ctaText,
          priceTestQuestion: candidateData.priceTestQuestion,
          surveyQuestions: candidateData.surveyQuestions,
          recommendedChannel: candidateData.recommendedChannel,
          expectedRisk: candidateData.expectedRisk,
          rationale: candidateData.rationale,
          status: 'ready',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        CandidateStorage.save(candidate);

        // Create campaign for this candidate
        const campaignId = `campaign_${candidateId}`;
        const campaign = {
          id: campaignId,
          skuCandidateId: candidateId,
          projectId,
          title: candidate.name,
          landingPageUrl: `/campaign/${candidateId}`,
          status: 'draft',
          metaPixelEnabled: false,
          createdAt: new Date().toISOString(),
        };

        CampaignStorage.save(campaign);
      });

      // Redirect to candidates page
      router.push(`/admin/sku-projects/${projectId}/candidates`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <div className="logo">K-Beauty SKU Validation</div>
          <nav className="nav">
            <Link href="/">홈</Link>
            <Link href="/admin">대시보드</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '2rem', fontSize: '1.875rem' }}>SKU 생성기</h1>

          {error && (
            <div className="alert alert-error">
              <strong>오류:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">타깃 국가</label>
                <select
                  name="targetCountry"
                  value={formData.targetCountry}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="US">미국</option>
                  <option value="JP">일본</option>
                  <option value="SEA">동남아</option>
                  <option value="EU">유럽</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">제품 카테고리</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="Skincare">스킨케어</option>
                  <option value="Suncare">선케어</option>
                  <option value="Cleansing">클렌징</option>
                  <option value="Makeup">메이크업</option>
                  <option value="Haircare">헤어케어</option>
                  <option value="Bodycare">바디케어</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">핵심 키워드 *</label>
                <textarea
                  name="inputKeywords"
                  value={formData.inputKeywords}
                  onChange={handleChange}
                  placeholder="예: 민감 피부, 장벽 케어, 가벼운 텍스처, 여름용"
                  className="form-control"
                  rows={3}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">타깃 고객 *</label>
                <textarea
                  name="targetCustomer"
                  value={formData.targetCustomer}
                  onChange={handleChange}
                  placeholder="예: 20대 미국 여성, 틱톡 사용자, Z세대 인플루언서"
                  className="form-control"
                  rows={2}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">고객 문제 *</label>
                <textarea
                  name="customerProblem"
                  value={formData.customerProblem}
                  onChange={handleChange}
                  placeholder="예: 가벼운 보습제를 찾기 어렵고, 무거운 크림이 답답함"
                  className="form-control"
                  rows={2}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">목표 판매가</label>
                <input
                  type="text"
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleChange}
                  placeholder="예: $15-25"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">원가 범위</label>
                <input
                  type="text"
                  name="costRange"
                  value={formData.costRange}
                  onChange={handleChange}
                  placeholder="예: $3-7"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">판매 채널</label>
                <select
                  name="channel"
                  value={formData.channel}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="Amazon">아마존</option>
                  <option value="TikTok Shop">틱톡 샵</option>
                  <option value="Shopify">Shopify</option>
                  <option value="Shopee">Shopee</option>
                  <option value="Offline Retail">오프라인 리테일</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">브랜드 톤</label>
                <select
                  name="brandTone"
                  value={formData.brandTone}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="Clean Beauty">클린 뷰티</option>
                  <option value="Derma Cosmetic">더마 코스메틱</option>
                  <option value="Emotional D2C">감성 D2C</option>
                  <option value="Functional">기능 중심</option>
                  <option value="Value-for-Money">가성비형</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">테스트 목표</label>
                <select
                  name="testGoal"
                  value={formData.testGoal}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="Concept Validation">콘셉트 검증</option>
                  <option value="Price Reaction">가격 반응</option>
                  <option value="Message Reaction">메시지 반응</option>
                  <option value="Target Customer">타깃 고객 검증</option>
                  <option value="Channel Fit">채널 적합성</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Link href="/admin">
                <button type="button" className="btn-secondary">
                  취소
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ minWidth: '200px' }}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> 생성 중...
                  </>
                ) : (
                  'SKU 후보 생성'
                )}
              </button>
            </div>
          </form>

          <div className="card mt-6">
            <h3 style={{ marginBottom: '1rem', color: '#6b7280' }}>💡 팁</h3>
            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', color: '#6b7280' }}>
              <li>키워드는 구체적으로 입력할수록 Gemini가 더 적합한 후보를 만듭니다</li>
              <li>타깃 고객이 실제로 겪는 문제를 정확히 적어주세요</li>
              <li>시장 조사를 바탕으로 판매가와 원가 범위를 입력하세요</li>
              <li>모든 항목이 다양한 SKU 옵션 생성에 중요합니다</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
