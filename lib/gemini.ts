// lib/gemini.ts
// Gemini API와의 통신을 담당

import { GoogleGenerativeAI } from '@google/generative-ai';

const ALLOWED_COUNTRIES = ['US', 'JP', 'SEA', 'EU'];
const ALLOWED_CATEGORIES = ['Skincare', 'Suncare', 'Cleansing', 'Makeup', 'Haircare', 'Bodycare'];
const ALLOWED_CHANNELS = ['Amazon', 'TikTok Shop', 'Shopify', 'Shopee', 'Offline Retail'];
const ALLOWED_TONES = ['Clean Beauty', 'Derma Cosmetic', 'Emotional D2C', 'Functional', 'Value-for-Money'];
const ALLOWED_GOALS = ['Concept Validation', 'Price Reaction', 'Message Reaction', 'Target Customer', 'Channel Fit'];

export interface SKUGenerationInput {
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

export interface GeminiCandidate {
  name: string;
  category: string;
  targetCountry: string;
  targetCustomer: string;
  concept: string;
  ingredientConcept: string;
  formulaType: string;
  price: number;
  cost: number;
  expectedMarginRate: number;
  benefit: string;
  positioningMessage: string;
  adHeadline: string;
  adSubCopy: string;
  landingHeroCopy: string;
  ctaText: string;
  priceTestQuestion: string;
  surveyQuestions: string[];
  recommendedChannel: string;
  expectedRisk: string;
  rationale: string;
}

export interface GeminiResponse {
  project: {
    name: string;
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
  };
  candidates: GeminiCandidate[];
}

function extractJsonPayload(text: string): string {
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const startIndex = text.indexOf('{');
  const endIndex = text.lastIndexOf('}');
  if (startIndex >= 0 && endIndex > startIndex) {
    return text.slice(startIndex, endIndex + 1).trim();
  }

  return text.trim();
}

async function parseGeminiResponse(model: any, responseText: string): Promise<GeminiResponse> {
  try {
    return JSON.parse(extractJsonPayload(responseText));
  } catch {
    const repairPrompt = `Convert the following Gemini output into valid JSON that matches the original schema. Return only the JSON object and nothing else.\n\n${responseText}`;
    const repairResult = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: repairPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0,
        topP: 0,
        topK: 1,
        maxOutputTokens: 4096,
      },
    });

    return JSON.parse(extractJsonPayload(repairResult.response.text()));
  }
}

export class GeminiService {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    this.client = new GoogleGenerativeAI(key);
    this.model = model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  async generateSKUCandidates(input: SKUGenerationInput): Promise<GeminiResponse> {
    const prompt = this.buildPrompt(input);

    const model = this.client.getGenerativeModel({
      model: this.model,
    });

    try {
      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 1,
          maxOutputTokens: 4096,
        },
      });

      const responseText = result.response.text();
      let response: GeminiResponse;

      try {
        response = await parseGeminiResponse(model, responseText);
      } catch (e) {
        console.error('Failed to parse Gemini response:', responseText);
        throw new Error('Invalid JSON response from Gemini');
      }

      // Validate response structure
      if (!response.candidates || response.candidates.length !== 3) {
        throw new Error('Gemini should return exactly 3 candidates');
      }

      return response;
    } catch (error) {
      console.error('Gemini API error:', error);
      console.warn('Falling back to mock SKU candidates after Gemini failure');
      return generateMockCandidates(input);
    }
  }

  private buildPrompt(input: SKUGenerationInput): string {
    return `당신은 K-Beauty 제품 기획자이자 글로벌 D2C 마케팅 전략가입니다.

당신의 과제: 제조 전에 검증할 수 있도록 작은 K-Beauty 브랜드를 위한 서로 다른 SKU 후보 3개를 생성하세요.

입력 정보:
- 타깃 국가: ${input.targetCountry}
- 제품 카테고리: ${input.category}
- 핵심 키워드: ${input.inputKeywords}
- 타깃 고객: ${input.targetCustomer}
- 고객 문제: ${input.customerProblem}
- 목표 판매가: ${input.priceRange}
- 목표 원가: ${input.costRange}
- 판매 채널: ${input.channel}
- 브랜드 톤: ${input.brandTone}
- 테스트 목표: ${input.testGoal}

핵심 지침:
1. 당신은 K-Beauty 제품 기획자이자 글로벌 D2C 마케팅 전략가입니다.
2. 제조 전에 테스트할 수 있는 SKU 콘셉트 3개를 생성하세요.
3. 각 콘셉트는 랜딩 페이지 광고로 검증 가능해야 합니다.
4. 3개 콘셉트는 서로 명확히 달라야 합니다.
5. 타깃 국가와 판매 채널에 적합한 메시지를 사용하세요.

화장품 표현 안전 수칙(필수):
- 다음 표현은 사용하지 마세요: cure, treat, medical improvement, acne treatment, dermatitis treatment, wrinkle removal guarantee, whitening guarantee, skin barrier recovery guarantee, instant skin changes, FDA approval.
- 과장되거나 허위의 효능 표현을 사용하지 마세요.
- 다음과 같은 안전한 표현을 사용하세요: 산뜻한 사용감, 촉촉한 마무리, 데일리 케어, 민감 피부에 순한, 가벼운 사용감, 편안한 사용감, 깔끔한 마무리, 피부 타입에 따라 다를 수 있음, 데일리 보습 루틴.
- 랜딩 페이지는 실제 판매용이 아니라 콘셉트 테스트용이어야 합니다.

CTA 지침:
- "Get Launch Alert", "I'm Interested", "Vote for This Concept" 대신 사용할 수 있는 자연스러운 한국어 CTA를 제안하세요.
- 랜딩 페이지에는 출시 전 콘셉트 테스트임을 명확히 표시해야 합니다.

응답 형식:
반드시 유효한 JSON만 반환하세요. 마크다운, 설명, 코드 블록은 절대 포함하지 마세요.

스키마:
{
  "project": {
    "name": "테스트 목표를 반영한 프로젝트명",
    "targetCountry": "string",
    "category": "string",
    "inputKeywords": "사용자 입력 키워드",
    "targetCustomer": "string",
    "customerProblem": "string",
    "priceRange": "string",
    "costRange": "string",
    "channel": "string",
    "brandTone": "string",
    "testGoal": "string"
  },
  "candidates": [
    {
      "name": "상품명",
      "category": "string",
      "targetCountry": "string",
      "targetCustomer": "string",
      "concept": "3~4문장 분량의 제품 콘셉트",
      "ingredientConcept": "핵심 성분 포커스",
      "formulaType": "제형 설명",
      "price": number,
      "cost": number,
      "expectedMarginRate": number,
      "benefit": "핵심 효익",
      "positioningMessage": "포지셔닝 메시지",
      "adHeadline": "광고 헤드라인",
      "adSubCopy": "보조 광고 문구",
      "landingHeroCopy": "랜딩 페이지 히어로 문구",
      "ctaText": "CTA 버튼 문구",
      "priceTestQuestion": "가격에 대한 반응을 묻는 문구",
      "surveyQuestions": ["질문 1", "질문 2", "질문 3"],
      "recommendedChannel": "테스트에 가장 적합한 채널",
      "expectedRisk": "예상 리스크 또는 과제",
      "rationale": "이 콘셉트가 시장성이 있는 이유"
    },
    ...2 more candidates
  ]
}

이제 이 K-Beauty 브랜드를 위해 서로 다르고 테스트 가능한 SKU 콘셉트 3개를 생성하세요.`;
  }
}

// Mock generator for development
export function generateMockCandidates(input: SKUGenerationInput): GeminiResponse {
  const now = new Date().toISOString();
  return {
    project: {
      name: `${input.category} Concept Test - ${input.testGoal}`,
      targetCountry: input.targetCountry,
      category: input.category,
      inputKeywords: input.inputKeywords,
      targetCustomer: input.targetCustomer,
      customerProblem: input.customerProblem,
      priceRange: input.priceRange,
      costRange: input.costRange,
      channel: input.channel,
      brandTone: input.brandTone,
      testGoal: input.testGoal,
    },
    candidates: [
      {
        name: '가벼운 수분 에센스',
        category: input.category,
        targetCountry: input.targetCountry,
        targetCustomer: input.targetCustomer,
        concept:
          '끈적임 없이 산뜻하게 수분을 채워주는 가벼운 에센스입니다. 매일의 스킨케어 루틴에서 여러 겹 레이어링하기 좋습니다.',
        ingredientConcept: '히알루론산 + 병풀 추출물',
        formulaType: '리퀴드 에센스',
        price: 22,
        cost: 4.5,
        expectedMarginRate: 0.795,
        benefit: '빠르게 흡수되면서 산뜻한 마무리로 수분을 채워줍니다.',
        positioningMessage: '무겁지 않은 수분 케어',
        adHeadline: '빠르게 흡수되는 수분 에센스',
        adSubCopy: '몇 초 만에 느끼는 데일리 수분감',
        landingHeroCopy: '무겁지 않은 수분 케어를 경험해 보세요',
        ctaText: '출시 알림 받기',
        priceTestQuestion: '이 데일리 에센스를 22달러에 구매할 의향이 있으신가요?',
        surveyQuestions: [
          '가장 선호하는 제형은 무엇인가요?',
          '이 제품을 루틴의 어느 단계에서 사용하시겠어요?',
          '가장 중요하게 보는 성분은 무엇인가요?',
        ],
        recommendedChannel: 'TikTok Shop',
        expectedRisk: '다단계 루틴에 익숙한 소비자에게는 너무 단순하게 보일 수 있음',
        rationale: '미니멀하고 효율적인 스킨케어를 찾는 서구 시장의 수요를 반영합니다',
      },
      {
        name: '장벽 케어 리커버리 크림',
        category: input.category,
        targetCountry: input.targetCountry,
        targetCustomer: input.targetCustomer,
        concept:
          '예민해진 피부를 편안하게 케어하기 위한 영양 크림입니다. 진정 성분과 가벼운 질감을 함께 담았습니다.',
        ingredientConcept: '병풀 추출물 + 세라마이드 + 판테놀',
        formulaType: '가벼운 크림',
        price: 28,
        cost: 5.5,
        expectedMarginRate: 0.804,
        benefit: '민감하고 예민한 피부에 편안한 보습감을 제공합니다.',
        positioningMessage: '민감 피부를 위한 편안한 케어',
        adHeadline: '민감 피부를 위한 순한 케어',
        adSubCopy: '순한 관리가 필요한 피부를 위한 설계',
        landingHeroCopy: '민감하고 예민한 피부를 위한 부드러운 케어',
        ctaText: '관심 있어요',
        priceTestQuestion: '이 장벽 케어 크림이 28달러라면 합리적이라고 느끼시나요?',
        surveyQuestions: [
          '민감한 피부로 고민한 적이 있으신가요?',
          '피부가 예민해지는 주된 원인은 무엇인가요?',
          '만족스럽다면 재구매 의향이 있으신가요?',
        ],
        recommendedChannel: 'Shopify',
        expectedRisk: '민감 피부 시장은 이미 경쟁 브랜드가 많음',
        rationale: '예민하고 손상된 피부 장벽을 위한 스킨케어에 대한 관심이 커지고 있습니다',
      },
      {
        name: '광채 부스팅 토너 패드',
        category: input.category,
        targetCountry: input.targetCountry,
        targetCustomer: input.targetCustomer,
        concept:
          '피부 결을 정돈하고 맑은 인상을 더해주는 프리소aked 토너 패드입니다. 외출이나 여행 중에도 편리하게 사용할 수 있습니다.',
        ingredientConcept: '나이아신아마이드 + 쌀 추출물 + 위치하젤',
        formulaType: '프리소aked 패드(60매)',
        price: 18,
        cost: 3.2,
        expectedMarginRate: 0.822,
        benefit: '빠르고 간편하게 피부를 정돈해 맑은 인상을 더합니다.',
        positioningMessage: '번거로움 없이 바로 쓰는 광채 케어',
        adHeadline: '한 번에 꺼내 쓰는 광채 패드',
        adSubCopy: '내 손안의 간편한 피부 정돈 루틴',
        landingHeroCopy: '쉽고 빠르게 사용할 수 있는 광채 패드',
        ctaText: '이 콘셉트에 투표',
        priceTestQuestion: '60매 기준 18달러라면 적절한 가격이라고 느끼시나요?',
        surveyQuestions: [
          '패드와 액상 토너 중 어떤 것을 더 선호하시나요?',
          '여행을 자주 하시나요?',
          '피부에 어떤 마무리감을 선호하시나요?',
        ],
        recommendedChannel: 'Amazon',
        expectedRisk: '토너 패드 카테고리는 경쟁이 치열해 차별화가 필요함',
        rationale: '재구매 가능성이 높고 간편함을 중시하는 Gen Z에 잘 맞습니다',
      },
    ],
  };
}
