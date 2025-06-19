// app/api/reactions/content/[contentId]/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../../../prisma/prisma"

export async function GET(
  req: Request,
  { params }: { params: { contentId: string } }
) {
  const { contentId } = params;

  try {
    const reactions = await prisma.reaction.findMany({
      where: { contentId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reactions);
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500 });
  }
}
