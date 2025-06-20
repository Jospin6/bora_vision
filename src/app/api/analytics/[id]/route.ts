// app/api/analytics/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../../prisma/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const analytics = await prisma.analytics.findUnique({
      where: { id },
      include: {
        content: true,
        user: true,
      },
    });

    if (!analytics) {
      return NextResponse.json({ error: 'Analytics not found' }, { status: 404 });
    }

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();

  try {
    const updatedAnalytics = await prisma.analytics.update({
      where: { id },
      data: {
        contentId: data.contentId || null,
        date: new Date(data.date),
        views: data.views,
        watchTime: data.watchTime,
        averageProgress: data.averageProgress,
        devices: data.devices,
        locations: data.locations,
        userId: data.userId || null,
      },
    });

    return NextResponse.json(updatedAnalytics);
  } catch (error) {
    console.error('Error updating analytics:', error);
    return NextResponse.json({ error: 'Failed to update analytics' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.analytics.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Analytics entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting analytics:', error);
    return NextResponse.json({ error: 'Failed to delete analytics' }, { status: 500 });
  }
}
