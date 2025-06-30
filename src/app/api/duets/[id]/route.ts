import { NextResponse } from 'next/server';
import { DuetService } from '@/lib/services/duet.service';
import { updateDuetSchema } from '@/lib/validations/duet.validation';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const duet = await DuetService.getDuetById(params.id);
    return NextResponse.json(duet);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create duet' },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = updateDuetSchema.parse(body);
    
    const updatedDuet = await DuetService.updateDuet(params.id, validatedData);
    return NextResponse.json(updatedDuet);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create duet' },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await DuetService.deleteDuet(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create duet' },
      { status: error.status || 500 }
    );
  }
}