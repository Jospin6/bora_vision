import { NextResponse } from 'next/server'
import prisma  from "../../../../../../prisma/prisma"

// GET - Récupérer les following d'un utilisateur
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const [following, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followerId: params.userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          following: {
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
        where: { followerId: params.userId }
      })
    ])

    return NextResponse.json({
      data: following.map((f: { following: any }) => f.following),
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch following' },
      { status: 500 }
    )
  }
}