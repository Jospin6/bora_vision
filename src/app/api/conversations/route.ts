// app/api/conversations/create/route.ts
import prisma from '../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { participantIds } = await request.json()

    // Vérifier s'il existe déjà une conversation entre ces utilisateurs (pour les conversations 1:1)
    if (participantIds.length === 2) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          participants: {
            every: {
              id: { in: participantIds }
            }
          }
        },
        include: {
          participants: true
        }
      })

      if (existingConversation) {
        return NextResponse.json(existingConversation)
      }
    }

    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: participantIds.map((id: string) => ({ id }))
        },
        UserConversation: {
          create: participantIds.map((userId: string) => ({
            userId
          }))
        }
      },
      include: {
        participants: true,
        UserConversation: true
      }
    })

    return NextResponse.json(conversation, { status: 201 })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}