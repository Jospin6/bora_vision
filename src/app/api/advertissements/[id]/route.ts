// app/api/advertisements/[id]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const ad = await prisma.advertisement.findUnique({
      where: { id },
    });

    if (!ad) {
      return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
    }

    return NextResponse.json(ad);
  } catch (error) {
    console.error('Error fetching advertisement:', error);
    return NextResponse.json({ error: 'Failed to fetch advertisement' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();

  try {
    const updatedAd = await prisma.advertisement.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        url: data.url,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive,
        targetAudience: data.targetAudience,
        impressions: data.impressions ?? 0,
        clicks: data.clicks ?? 0,
      },
    });

    return NextResponse.json(updatedAd);
  } catch (error) {
    console.error('Error updating advertisement:', error);
    return NextResponse.json({ error: 'Failed to update advertisement' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.advertisement.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Advertisement deleted successfully' });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    return NextResponse.json({ error: 'Failed to delete advertisement' }, { status: 500 });
  }
}
