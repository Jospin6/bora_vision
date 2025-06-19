// app/api/advertisements/[id]/track/impression/route.ts
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
        impressions: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      message: 'Impression tracked',
      impressions: ad.impressions,
    });
  } catch (error) {
    console.error('Error tracking impression:', error);
    return NextResponse.json(
      { error: 'Failed to track impression' },
      { status: 500 }
    );
  }
}
