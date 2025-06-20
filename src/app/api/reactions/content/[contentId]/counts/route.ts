// app/api/reactions/content/[contentId]/counts/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../../../../prisma/prisma"

export async function GET(
  req: Request,
  { params }: { params: { contentId: string } }
) {
  const { contentId } = params;

  try {
    const reactions = await prisma.reaction.groupBy({
      by: ['type'],
      where: { contentId },
      _count: {
        type: true,
      },
    });

    // Transform to { type: count }
    const counts = reactions.reduce((acc: Record<string, number>, reaction: { type: string | number; _count: { type: number; }; }) => {
      acc[reaction.type] = reaction._count.type;
      return acc;
    }, {});

    return NextResponse.json(counts);
  } catch (error) {
    console.error('Error counting reactions:', error);
    return NextResponse.json({ error: 'Failed to count reactions' }, { status: 500 });
  }
}
