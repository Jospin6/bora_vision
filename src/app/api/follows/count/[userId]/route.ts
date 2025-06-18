import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Récupérer les compteurs de followers/following
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const [followersCount, followingCount] = await Promise.all([
      prisma.follow.count({
        where: { followingId: params.userId }
      }),
      prisma.follow.count({
        where: { followerId: params.userId }
      })
    ])

    return NextResponse.json({
      followersCount,
      followingCount
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch follow counts' },
      { status: 500 }
    )
  }
}