export interface CandidateMetrics {
  visits: number;
  ctaClicks: number;
  leads: number;
  positivePriceResponses: number;
  totalPriceResponses: number;
  surveySubmits: number;
  avgTimeOnPageSec: number;
  scroll50Rate: number; // 0..1
}

export interface ValidationScoreResult {
  score: number;
  breakdown: {
    cta: number;
    lead: number;
    price: number;
    survey: number;
    time: number;
    scroll: number;
  };
  judgment: string;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function calculateValidationScore(m: CandidateMetrics): ValidationScoreResult {
  const visitBase = Math.max(1, m.visits);
  const ctaRate = clamp01(m.ctaClicks / visitBase);
  const leadRate = clamp01(m.leads / visitBase);
  const priceRate = clamp01(m.totalPriceResponses > 0 ? m.positivePriceResponses / m.totalPriceResponses : 0);
  const surveyRate = clamp01(m.surveySubmits / visitBase);
  const timeRate = clamp01(m.avgTimeOnPageSec / 90); // saturates at 90s
  const scrollRate = clamp01(m.scroll50Rate);

  const breakdown = {
    cta: ctaRate * 25,
    lead: leadRate * 25,
    price: priceRate * 20,
    survey: surveyRate * 10,
    time: timeRate * 10,
    scroll: scrollRate * 10,
  };

  const score = Number((breakdown.cta + breakdown.lead + breakdown.price + breakdown.survey + breakdown.time + breakdown.scroll).toFixed(1));

  const judgment =
    score >= 80
      ? '출시 검토 가능'
      : score >= 60
      ? '메시지/가격 수정 후 재검증'
      : score >= 40
      ? '타깃 또는 포지셔닝 재설계 필요'
      : '출시 보류';

  return { score, breakdown, judgment };
}
