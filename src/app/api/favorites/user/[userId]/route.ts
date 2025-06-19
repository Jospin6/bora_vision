import { NextResponse } from 'next/server'
import prisma  from "../../../../../../prisma/prisma"

// GET - Récupérer les favoris d'un utilisateur
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')

    const where = {
      userId: params.userId,
      ...(type && { content: { type } })
    }

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          content: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              type: true,
              duration: true,
              views: true
            }
          }
        }
      }),
      prisma.favorite.count({ where })
    ])

    return NextResponse.json({
      data: favorites,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user favorites' },
      { status: 500 }
    )
  }
}