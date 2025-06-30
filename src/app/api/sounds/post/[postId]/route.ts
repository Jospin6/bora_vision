// app/api/sounds/post/[postId]/route.ts
import prisma from '../../../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const sounds = await prisma.sound.findMany({
      where: { postId: params.postId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(sounds)
  } catch (error) {
    console.error('Error fetching sounds:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sounds' },
      { status: 500 }
    )
  }
}