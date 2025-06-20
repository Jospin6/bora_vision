// app/api/payments/user/[userId]/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../../../prisma/prisma"

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user payments' },
      { status: 500 }
    );
  }
}
