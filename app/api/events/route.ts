// app/api/events/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { EventStorage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      timestamp: new Date().toISOString(),
    };

    EventStorage.save(event);

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Error saving event:', error);
    return NextResponse.json(
      { error: 'Failed to save event' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const events = EventStorage.getAll();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error retrieving events:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve events' },
      { status: 500 }
    );
  }
}
