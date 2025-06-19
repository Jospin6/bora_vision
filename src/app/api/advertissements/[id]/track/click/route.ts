// app/api/advertisements/[id]/track/click/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../../../../prisma/prisma"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const ad = await prisma.advertisement.update({
      where: { id },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      message: 'Click tracked',
      clicks: ad.clicks,
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    );
  }
}
