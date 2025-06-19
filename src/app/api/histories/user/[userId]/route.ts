// app/api/history/user/[userId]/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../../../prisma/prisma"

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const history = await prisma.history.findMany({
      where: { userId },
      include: {
        content: true,
      },
      orderBy: {
        lastWatchedAt: 'desc',
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history for user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history for user' },
      { status: 500 }
    );
  }
}
