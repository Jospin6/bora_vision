import { NextResponse } from 'next/server';
import { DuetService } from '@/lib/services/duet.service';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const duets = await DuetService.getDuetsByUser(params.userId);
    return NextResponse.json(duets);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create duet' },
      { status: error.status || 500 }
    );
  }
}