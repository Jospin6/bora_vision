import { NextResponse } from 'next/server'
import prisma  from "../../../../prisma/prisma"

// Types
interface FavoriteCreateInput {
  userId: string
  contentId: string
}

// GET - Récupérer tous les favoris (avec filtres)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const contentId = searchParams.get('contentId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where = {
      ...(userId && { userId }),
      ...(contentId && { contentId })
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
              type: true
            }
          },
          user: {
            select: {
              id: true,
              username: true
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
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau favori
export async function POST(request: Request) {
  try {
    const body: FavoriteCreateInput = await request.json()

    // Validation
    if (!body.userId || !body.contentId) {
      return NextResponse.json(
        { error: 'userId and contentId are required' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe
    const userExists = await prisma.user.findUnique({
      where: { id: body.userId }
    })

    if (!userExists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Vérifier si le contenu existe
    const contentExists = await prisma.content.findUnique({
      where: { id: body.contentId }
    })

    if (!contentExists) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // Vérifier si le favori existe déjà
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: body.userId,
        contentId: body.contentId
      }
    })

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Content already in favorites' },
        { status: 409 }
      )
    }

    // Créer le favori
    const favorite = await prisma.favorite.create({
      data: {
        userId: body.userId,
        contentId: body.contentId
      },
      include: {
        content: {
          select: {
            id: true,
            title: true
          }
        },
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create favorite' },
      { status: 500 }
    )
  }
}

// app/
//   api/
//     favorites/
//       route.ts               // GET (liste) et POST
//       [id]/
//         route.ts             // GET (détail), DELETE
//       user/
//         [userId]/
//           route.ts           // GET favoris d'un utilisateur
//       check/
//         route.ts             // GET vérifier si un contenu est favori