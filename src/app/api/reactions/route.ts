// app/api/reactions/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../prisma/prisma"

export async function GET() {
  try {
    const reactions = await prisma.reaction.findMany({
      include: {
        user: true,
        content: true,
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

export async function POST(req: Request) {
  const data = await req.json();

  try {
    // Vérifie si une reaction existe déjà pour user + content
    const existing = await prisma.reaction.findUnique({
      where: {
        userId_contentId: {
          userId: data.userId,
          contentId: data.contentId,
        },
      },
    });

    if (existing) {
      // Si elle existe → update le type
      const updated = await prisma.reaction.update({
        where: {
          userId_contentId: {
            userId: data.userId,
            contentId: data.contentId,
          },
        },
        data: {
          type: data.type,
        },
      });

      return NextResponse.json(updated);
    } else {
      // Sinon, créer une nouvelle reaction
      const newReaction = await prisma.reaction.create({
        data: {
          userId: data.userId,
          contentId: data.contentId,
          type: data.type,
        },
      });

      return NextResponse.json(newReaction);
    }
  } catch (error) {
    console.error('Error creating/updating reaction:', error);
    return NextResponse.json({ error: 'Failed to create/update reaction' }, { status: 500 });
  }
}