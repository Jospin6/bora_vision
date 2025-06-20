// app/api/payments/stats/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../../prisma/prisma"

export async function GET() {
  try {
    const totalRevenueResult = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'completed' },
    });

    const totalPayments = await prisma.payment.count();

    const completed = await prisma.payment.count({
      where: { status: 'completed' },
    });

    const pending = await prisma.payment.count({
      where: { status: 'pending' },
    });

    const failed = await prisma.payment.count({
      where: { status: 'failed' },
    });

    const refunded = await prisma.payment.count({
      where: { status: 'refunded' },
    });

    const stats = {
      totalRevenue: totalRevenueResult._sum.amount || 0,
      totalPayments,
      completed,
      pending,
      failed,
      refunded,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment stats' },
      { status: 500 }
    );
  }
}
