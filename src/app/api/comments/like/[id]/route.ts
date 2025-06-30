// app/api/comments/like/[id]/route.ts
import prisma from '../../../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json()

    // Vérifier si le like existe déjà
    const existingLike = await prisma.likeComment.findFirst({
      where: {
        userId,
        commentId: params.id,
      },
    })

    if (existingLike) {
      // Retirer le like
      await prisma.likeComment.delete({
        where: { id: existingLike.id },
      })
      return NextResponse.json({ liked: false })
    }

    // Ajouter le like
    await prisma.likeComment.create({
      data: {
        userId,
        commentId: params.id,
      },
    })
    return NextResponse.json({ liked: true })
  } catch (error) {
    console.error('Error toggling comment like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle comment like' },
      { status: 500 }
    )
  }
}