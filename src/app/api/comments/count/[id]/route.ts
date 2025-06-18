// app/api/comments/count/[contentId]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { contentId: string } }
) {
  const { contentId } = params;

  try {
    const count = await prisma.comment.count({
      where: { contentId },
    });

    return NextResponse.json({ contentId, totalComments: count });
  } catch (error) {
    console.error('Error counting comments:', error);
    return NextResponse.json({ error: 'Failed to count comments' }, { status: 500 });
  }
}
