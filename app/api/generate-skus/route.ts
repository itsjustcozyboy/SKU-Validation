// app/api/generate-skus/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GeminiService, SKUGenerationInput, generateMockCandidates } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: SKUGenerationInput = body;

    // Verify required fields
    if (!input.targetCountry || !input.category || !input.inputKeywords) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if we should use mock generator
    const useMock = process.env.DEV_MOCK_GEMINI === 'true';
    if (useMock) {
      console.log('Using mock generator for development');
      return NextResponse.json(generateMockCandidates(input));
    }

    // Check if API key is set
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'GEMINI_API_KEY is not configured',
          message: 'Please set GEMINI_API_KEY in your environment variables',
        },
        { status: 500 }
      );
    }

    // Call Gemini API
    const gemini = new GeminiService(apiKey);
    const response = await gemini.generateSKUCandidates(input);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating SKU candidates:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to generate SKU candidates',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
