// app/api/surveys/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { SurveyStorage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const survey = {
      id: `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      createdAt: new Date().toISOString(),
    };

    SurveyStorage.save(survey);
    return NextResponse.json({ success: true, survey });
  } catch (error) {
    console.error('Error saving survey:', error);
    return NextResponse.json(
      { error: 'Failed to save survey' },
      { status: 500 }
    );
  }
}
