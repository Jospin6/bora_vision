// app/api/sounds/create/route.ts
import prisma from '../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, artist, audioUrl, duration, postId } = await request.json()

    const sound = await prisma.sound.create({
      data: {
        name,
        artist,
        audioUrl,
        duration,
        postId
      },
      include: {
        post: true
      }
    })

    return NextResponse.json(sound, { status: 201 })
  } catch (error) {
    console.error('Error creating sound:', error)
    return NextResponse.json(
      { error: 'Failed to create sound' },
      { status: 500 }
    )
  }
}