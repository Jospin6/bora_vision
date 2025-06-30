import { NextResponse } from 'next/server';
import { DuetService } from '@/lib/services/duet.service';
import { createDuetSchema } from '@/lib/validations/duet.validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createDuetSchema.parse(body);
    
    const duet = await DuetService.createDuet(validatedData);
    
    return NextResponse.json(duet, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create duet' },
      { status: error.status || 500 }
    );
  }
}

export async function GET() {
  try {
    const duets = await DuetService.getAllDuets();
    return NextResponse.json(duets);
  } catch (error: any) {
    return  NextResponse.json(
      { error: error.message || 'Failed to create duet' },
      { status: error.status || 500 }
    );
  }
}