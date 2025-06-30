// app/api/views/track/route.ts
import prisma from '../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { postId, viewerId, device, country, duration } = await request.json()

    // Vérifier si la vue existe déjà (pour mise à jour)
    const existingView = viewerId 
      ? await prisma.view.findFirst({
          where: { postId, viewerId }
        })
      : null

    const view = existingView
      ? await prisma.view.update({
          where: { id: existingView.id },
          data: {
            duration: duration ?? existingView.duration,
          }
        })
      : await prisma.view.create({
          data: {
            postId,
            viewerId,
            device,
            country,
            duration
          }
        })

    return NextResponse.json(view, { status: 201 })
  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    )
  }
}