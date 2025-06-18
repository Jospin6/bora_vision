// app/api/comments/content/[contentId]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { contentId: string } }
) {
  const { contentId } = params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        contentId,
        parentId: null, // top-level only
      },
      include: {
        replies: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            user: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}
