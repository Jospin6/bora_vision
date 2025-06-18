// app/api/analytics/track/view/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();

  const { contentId, userId, device, location } = data;

  if (!contentId) {
    return NextResponse.json({ error: 'contentId is required' }, { status: 400 });
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
        views: { increment: 1 },
        devices: device
          ? {
              increment: {
                [device]: 1,
              },
            }
          : undefined,
        locations: location
          ? {
              increment: {
                [location]: 1,
              },
            }
          : undefined,
      },
      create: {
        contentId,
        date: today,
        views: 1,
        watchTime: 0,
        averageProgress: 0,
        devices: device ? { [device]: 1 } : {},
        locations: location ? { [location]: 1 } : {},
        userId: userId || null,
      },
    });

    return NextResponse.json({ message: 'View tracked', analytics });
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
}
