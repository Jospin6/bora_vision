// app/api/messages/react/[id]/route.ts
import prisma from '../../../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { emoji, userId } = await request.json()

    // Vérifier si la réaction existe déjà
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        messageId: params.id,
        userId
      }
    })

    const reaction = existingReaction
      ? await prisma.reaction.delete({
          where: { id: existingReaction.id }
        })
      : await prisma.reaction.create({
          data: {
            emoji,
            userId,
            messageId: params.id
          }
        })

    return NextResponse.json(reaction)
  } catch (error) {
    console.error('Error toggling reaction:', error)
    return NextResponse.json(
      { error: 'Failed to toggle reaction' },
      { status: 500 }
    )
  }
}