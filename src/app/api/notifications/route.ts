// app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../prisma/prisma"

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const newNotification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || null,
        relatedId: data.relatedId || null,
        metadata: data.metadata || {},
        isRead: false,
        readAt: null,
      },
    });

    return NextResponse.json(newNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
