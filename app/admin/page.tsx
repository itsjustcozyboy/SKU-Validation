// app/admin/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProjectStorage, CandidateStorage, EventStorage, LeadStorage, SurveyStorage } from '@/lib/storage';
import { calculateValidationScore } from '@/src/domain/scoring';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allProjects = ProjectStorage.getAll();
    const allCandidates = CandidateStorage.getAll();
    const allEvents = EventStorage.getAll();
    const allLeads = LeadStorage.getAll();
    const allSurveys = SurveyStorage.getAll();

    setProjects(allProjects);
    setCandidates(allCandidates);

    const stats = {
      totalProjects: allProjects.length,
      totalCandidates: allCandidates.length,
      totalVisits: allEvents.filter(e => e.eventType === 'page_view').length,
      totalCTAClicks: allEvents.filter(e => e.eventType === 'hero_cta_click').length,
      totalLeads: allLeads.length,
      totalSurveys: allSurveys.length,
      avgValidationScore:
        allCandidates.length > 0
          ? (
              allCandidates.reduce((sum, candidate) => {
                const metrics = {
                  visits: allEvents.filter(e => e.skuCandidateId === candidate.id && e.eventType === 'page_view').length,
                  ctaClicks: allEvents.filter(e => e.skuCandidateId === candidate.id && e.eventType === 'hero_cta_click').length,
                  leads: allLeads.filter(l => l.skuCandidateId === candidate.id).length,
                  positivePriceResponses: allEvents.filter(
                    e =>
                      e.skuCandidateId === candidate.id &&
                      e.eventType === 'price_response' &&
                      (e.eventValue === 'Very Interested' || e.eventValue === 'Somewhat Interested')
                  ).length,
                  totalPriceResponses: allEvents.filter(
                    e => e.skuCandidateId === candidate.id && e.eventType === 'price_response'
                  ).length,
                  surveySubmits: allSurveys.filter(s => s.skuCandidateId === candidate.id).length,
                  avgTimeOnPageSec: 0,
                  scroll50Rate: 0,
                };
                return sum + calculateValidationScore(metrics).score;
              }, 0) / allCandidates.length
            ).toFixed(1)
          : 0,
    };

    setStats(stats);
    setLoading(false);
  }, []);

  const calculateMetrics = (candidateId: string) => {
    const allEvents = EventStorage.getAll();
    const allLeads = LeadStorage.getAll();
    const allSurveys = SurveyStorage.getAll();

    const events = allEvents.filter(e => e.skuCandidateId === candidateId);
    const leads = allLeads.filter(l => l.skuCandidateId === candidateId);
    const surveys = allSurveys.filter(s => s.skuCandidateId === candidateId);

    const pageViews = events.filter(e => e.eventType === 'page_view').length;
    const ctaClicks = events.filter(e => e.eventType === 'hero_cta_click').length;
    const ctaRate = pageViews > 0 ? ((ctaClicks / pageViews) * 100).toFixed(1) : '0';
    const leadRate = pageViews > 0 ? ((leads.length / pageViews) * 100).toFixed(1) : '0';

    return {
      visits: pageViews,
      ctaClicks,
      ctaRate,
      leads: leads.length,
      leadRate,
      surveys: surveys.length,
    };
  };

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
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>관리자 대시보드</h1>
          <p style={{ color: '#6b7280' }}>SKU 검증 프로젝트와 후보를 한눈에 확인합니다</p>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">전체 프로젝트</div>
            <div className="kpi-value">{stats.totalProjects}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">전체 SKU 후보</div>
            <div className="kpi-value">{stats.totalCandidates}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">전체 페이지 방문</div>
            <div className="kpi-value">{stats.totalVisits}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">전체 CTA 클릭</div>
            <div className="kpi-value">{stats.totalCTAClicks}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">전체 리드</div>
            <div className="kpi-value">{stats.totalLeads}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">전체 설문</div>
            <div className="kpi-value">{stats.totalSurveys}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">평균 검증 점수</div>
            <div className="kpi-value">{stats.avgValidationScore}/100</div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>내 프로젝트</h2>

          {projects.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              <p>아직 프로젝트가 없습니다.</p>
              <Link href="/admin/sku-generator">
                <button style={{ marginTop: '1rem' }} className="btn-primary">
                  첫 프로젝트 만들기
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>프로젝트명</th>
                    <th>국가</th>
                    <th>카테고리</th>
                    <th>후보 수</th>
                    <th>테스트 목표</th>
                    <th>생성일</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => {
                    const candidateCount = candidates.filter(c => c.projectId === project.id).length;
                    return (
                      <tr key={project.id}>
                        <td style={{ fontWeight: '600' }}>{project.name}</td>
                        <td>{project.targetCountry}</td>
                        <td>{project.category}</td>
                        <td>{candidateCount}</td>
                        <td>{Array.isArray(project.testGoal) ? project.testGoal[0] : project.testGoal}</td>
                        <td style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <Link href={`/admin/sku-projects/${project.id}/candidates`}>
                            <button className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}>
                              보기
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Candidates Section */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>모든 SKU 후보</h2>

          {candidates.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              <p>아직 후보가 없습니다.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>SKU명</th>
                    <th>가격</th>
                    <th>방문 수</th>
                    <th>CTA 클릭</th>
                    <th>CTR</th>
                    <th>리드</th>
                    <th>설문</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map(candidate => {
                    const metrics = calculateMetrics(candidate.id);
                    return (
                      <tr key={candidate.id}>
                        <td style={{ fontWeight: '600' }}>{candidate.name}</td>
                        <td>${candidate.price}</td>
                        <td>{metrics.visits}</td>
                        <td>{metrics.ctaClicks}</td>
                        <td>{metrics.ctaRate}%</td>
                        <td>{metrics.leads}</td>
                        <td>{metrics.surveys}</td>
                        <td>
                          <Link href={`/admin/reports/${candidate.id}`}>
                            <button className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}>
                              리포트
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href="/admin/sku-generator">
            <button className="btn-primary">+ 새 프로젝트 만들기</button>
          </Link>
        </div>
      </main>
    </div>
  );
}
