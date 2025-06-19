// app/api/history/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../../prisma/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const history = await prisma.history.findUnique({
      where: { id },
      include: {
        user: true,
        content: true,
      },
    });

    if (!history) {
      return NextResponse.json({ error: 'History not found' }, { status: 404 });
    }

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();

  try {
    const updatedHistory = await prisma.history.update({
      where: { id },
      data: {
        progress: data.progress,
        lastWatchedAt: new Date(),
        deviceInfo: data.deviceInfo,
      },
    });

    return NextResponse.json(updatedHistory);
  } catch (error) {
    console.error('Error updating history:', error);
    return NextResponse.json({ error: 'Failed to update history' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.history.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'History deleted successfully' });
  } catch (error) {
    console.error('Error deleting history:', error);
    return NextResponse.json({ error: 'Failed to delete history' }, { status: 500 });
  }
}
