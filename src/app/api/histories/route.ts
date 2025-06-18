// app/api/history/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const histories = await prisma.history.findMany({
      include: {
        user: true,
        content: true,
      },
      orderBy: {
        lastWatchedAt: 'desc',
      },
    });

    return NextResponse.json(histories);
  } catch (error) {
    console.error('Error fetching histories:', error);
    return NextResponse.json({ error: 'Failed to fetch histories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  try {
    // On vérifie s'il existe déjà une History pour ce userId + contentId
    const existing = await prisma.history.findFirst({
      where: {
        userId: data.userId,
        contentId: data.contentId,
      },
    });

    if (existing) {
      // On update le progress et la date
      const updated = await prisma.history.update({
        where: { id: existing.id },
        data: {
          progress: data.progress ?? existing.progress,
          lastWatchedAt: new Date(),
          deviceInfo: data.deviceInfo ?? existing.deviceInfo,
        },
      });

      return NextResponse.json(updated);
    } else {
      // Sinon on crée une nouvelle History
      const newHistory = await prisma.history.create({
        data: {
          userId: data.userId,
          contentId: data.contentId,
          progress: data.progress ?? 0,
          deviceInfo: data.deviceInfo,
        },
      });

      return NextResponse.json(newHistory);
    }
  } catch (error) {
    console.error('Error creating/updating history:', error);
    return NextResponse.json({ error: 'Failed to create/update history' }, { status: 500 });
  }
}
