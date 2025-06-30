// app/api/posts/like/[id]/route.ts
import prisma from '../../../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json()

    // Vérifier si l'utilisateur a déjà liké
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId: params.id,
      },
    })

    if (existingLike) {
      // Retirer le like
      await prisma.like.delete({
        where: { id: existingLike.id },
      })
      return NextResponse.json({ liked: false })
    }

    // Ajouter le like
    await prisma.like.create({
      data: {
        userId,
        postId: params.id,
      },
    })
    return NextResponse.json({ liked: true })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}