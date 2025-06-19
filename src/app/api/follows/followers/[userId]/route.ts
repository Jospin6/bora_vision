import { NextResponse } from 'next/server'
import prisma  from "../../../../../../prisma/prisma"

// GET - Récupérer les followers d'un utilisateur
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const [followers, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: params.userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              avatar: true,
              bio: true
            }
          }
        }
      }),
      prisma.follow.count({
        where: { followingId: params.userId }
      })
    ])

    return NextResponse.json({
      data: followers.map((f: { follower: any }) => f.follower),
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch followers' },
      { status: 500 }
    )
  }
}