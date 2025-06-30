// app/api/sounds/[id]/route.ts
import prisma from '../../../../../prisma/prisma' 
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.sound.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Sound deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting sound:', error)
    return NextResponse.json(
      { error: 'Failed to delete sound' },
      { status: 500 }
    )
  }
}