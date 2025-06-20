// app/api/analytics/track/progress/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../../../prisma/prisma"

export async function POST(req: Request) {
  const data = await req.json();

  const { contentId, userId, watchTime, progress } = data;

  if (!contentId || !watchTime || !progress) {
    return NextResponse.json({ error: 'contentId, watchTime, and progress are required' }, { status: 400 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const analytics = await prisma.analytics.upsert({
      where: {
        contentId_date_userId: {
          contentId,
          date: today,
          userId: userId || null,
        },
      },
      update: {
        watchTime: { increment: watchTime },
        averageProgress: progress,
      },
      create: {
        contentId,
        date: today,
        views: 0,
        watchTime,
        averageProgress: progress,
        devices: {},
        locations: {},
        userId: userId || null,
      },
    });

    return NextResponse.json({ message: 'Progress tracked', analytics });
  } catch (error) {
    console.error('Error tracking progress:', error);
    return NextResponse.json({ error: 'Failed to track progress' }, { status: 500 });
  }
}
