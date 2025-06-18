import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Vérifier si un follow existe
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const followerId = searchParams.get('followerId')
    const followingId = searchParams.get('followingId')

    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: 'followerId and followingId are required' },
        { status: 400 }
      )
    }

    const follow = await prisma.follow.findFirst({
      where: {
        followerId,
        followingId
      },
      select: {
        id: true
      }
    })

    return NextResponse.json({
      isFollowing: !!follow,
      followId: follow?.id || null
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check follow status' },
      { status: 500 }
    )
  }
}