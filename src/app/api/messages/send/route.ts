// app/api/messages/send/route.ts
import prisma from '../../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { conversationId, senderId, content, mediaUrl, repliedToId } = await request.json()

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
        mediaUrl,
        repliedToId
      },
      include: {
        sender: true,
        repliedTo: {
          include: {
            sender: true
          }
        }
      }
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}