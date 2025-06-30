// app/api/topics/follow/route.ts
import prisma from '../../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, topicId } = await request.json()

    // Vérifier si l'utilisateur suit déjà le topic
    const existingFollow = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        Interest: {
          where: { id: topicId }
        }
      }
    })

    const user = existingFollow?.Interest?.length
      ? await prisma.user.update({
          where: { id: userId },
          data: {
            Interest: {
              disconnect: { id: topicId }
            }
          }
        })
      : await prisma.user.update({
          where: { id: userId },
          data: {
            Interest: {
              connect: { id: topicId }
            }
          }
        })

    return NextResponse.json({
      following: !existingFollow?.Interest?.length
    })
  } catch (error) {
    console.error('Error toggling topic follow:', error)
    return NextResponse.json(
      { error: 'Failed to toggle topic follow' },
      { status: 500 }
    )
  }
}