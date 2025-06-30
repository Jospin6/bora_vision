// app/api/follows/toggle/route.ts
import prisma from '../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { followerId, followingId } = await request.json()

    // Vérifier si le follow existe déjà
    const existingFollow = await prisma.follow.findFirst({
      where: { followerId, followingId }
    })

    const follow = existingFollow
      ? await prisma.follow.delete({
          where: { id: existingFollow.id }
        })
      : await prisma.follow.create({
          data: { followerId, followingId }
        })

    return NextResponse.json({
      following: !existingFollow
    })
  } catch (error) {
    console.error('Error toggling follow:', error)
    return NextResponse.json(
      { error: 'Failed to toggle follow' },
      { status: 500 }
    )
  }
}