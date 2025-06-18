// app/api/advertisements/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ads = await prisma.advertisement.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(ads);
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    return NextResponse.json({ error: 'Failed to fetch advertisements' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const newAd = await prisma.advertisement.create({
      data: {
        title: data.title,
        description: data.description || null,
        image: data.image,
        url: data.url || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive ?? true,
        targetAudience: data.targetAudience || {},
      },
    });

    return NextResponse.json(newAd);
  } catch (error) {
    console.error('Error creating advertisement:', error);
    return NextResponse.json({ error: 'Failed to create advertisement' }, { status: 500 });
  }
}
