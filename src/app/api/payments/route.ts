// app/api/payments/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../prisma/prisma"

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const newPayment = await prisma.payment.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        currency: data.currency || 'USD',
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        status: data.status,
        description: data.description || null,
        processedAt: data.processedAt ? new Date(data.processedAt) : null,
      },
    });

    return NextResponse.json(newPayment);
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
