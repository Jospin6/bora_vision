// app/api/notifications/user/[userId]/markAllRead/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../../../../prisma/prisma"

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({
      message: `Marked ${result.count} notifications as read`,
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const result = await prisma.notification.deleteMany({
      where: {
        userId,
        isRead: true,
      },
    });

    return NextResponse.json({
      message: `Deleted ${result.count} read notifications`,
    });
  } catch (error) {
    console.error('Error deleting read notifications:', error);
    return NextResponse.json(
      { error: 'Failed to delete read notifications' },
      { status: 500 }
    );
  }
}