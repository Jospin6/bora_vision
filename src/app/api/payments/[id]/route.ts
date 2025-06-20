// app/api/payments/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../../prisma/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json({ error: 'Failed to fetch payment' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();

  try {
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        status: data.status,
        description: data.description,
        processedAt: data.processedAt ? new Date(data.processedAt) : null,
      },
    });

    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.payment.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 });
  }
}
