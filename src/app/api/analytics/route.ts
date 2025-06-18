// app/api/analytics/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const analytics = await prisma.analytics.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        content: true,
        user: true,
      },
    });

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const newAnalytics = await prisma.analytics.create({
      data: {
        contentId: data.contentId || null,
        date: new Date(data.date),
        views: data.views ?? 0,
        watchTime: data.watchTime ?? 0,
        averageProgress: data.averageProgress ?? 0,
        devices: data.devices || {},
        locations: data.locations || {},
        userId: data.userId || null,
      },
    });

    return NextResponse.json(newAnalytics);
  } catch (error) {
    console.error('Error creating analytics:', error);
    return NextResponse.json({ error: 'Failed to create analytics' }, { status: 500 });
  }
}
