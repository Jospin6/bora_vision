// app/api/user-conversations/[conversationId]/route.ts
import prisma from '../../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { userId, isMuted, lastSeenAt } = await request.json()

    const updateData: any = {}
    if (isMuted !== undefined) updateData.isMuted = isMuted
    if (lastSeenAt !== undefined) updateData.lastSeenAt = new Date()

    const userConversation = await prisma.userConversation.update({
      where: {
        userId_conversationId: {
          userId,
          conversationId: params.conversationId
        }
      },
      data: updateData
    })

    return NextResponse.json(userConversation)
  } catch (error) {
    console.error('Error updating user conversation:', error)
    return NextResponse.json(
      { error: 'Failed to update conversation settings' },
      { status: 500 }
    )
  }
}