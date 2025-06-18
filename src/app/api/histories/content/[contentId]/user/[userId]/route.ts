// app/api/history/content/[contentId]/user/[userId]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { contentId: string; userId: string } }
) {
  const { contentId, userId } = params;

  try {
    const history = await prisma.history.findFirst({
      where: {
        contentId,
        userId,
      },
      include: {
        content: true,
      },
      orderBy: {
        lastWatchedAt: 'desc',
      },
    });

    if (!history) {
      return NextResponse.json(
        { message: 'No history found for this user and content' },
        { status: 404 }
      );
    }

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history for content and user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history for content and user' },
      { status: 500 }
    );
  }
}
