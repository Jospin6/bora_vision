// app/api/comments/replies/[parentId]/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../../../prisma/prisma"

export async function GET(
  req: Request,
  { params }: { params: { parentId: string } }
) {
  const { parentId } = params;

  try {
    const replies = await prisma.comment.findMany({
      where: { parentId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
  }
}
