import { NextResponse, NextRequest } from 'next/server'
import prisma  from "../../../../prisma/prisma"

// Types
interface ContentCreateInput {
  title: string
  description?: string
  thumbnail: string
  type: any
  duration?: number
  releaseDate?: string
  isExclusive?: boolean
  ageRestriction?: number
  creatorId: string
  categoryIds?: string[]
  tagIds?: string[]
}

// GET - Récupérer tous les contenus
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') as any | undefined
    const status = searchParams.get('status') as any | undefined
    const featured = searchParams.get('featured')
    const categoryId = searchParams.get('categoryId')
    const creatorId = searchParams.get('creatorId')

    const where = {
      ...(type && { type }),
      ...(status && { status }),
      ...(featured === 'true' && { isFeatured: true }),
      ...(categoryId && { categories: { some: { id: categoryId } } }),
      ...(creatorId && { creatorId })
    }

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          },
          categories: {
            select: {
              id: true,
              name: true
            }
          },
          tags: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              favorites: true,
              comments: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.content.count({ where })
    ])

    return NextResponse.json({
      data: contents,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contents' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau contenu
export async function POST(request: NextRequest) {
  try {
    const body: ContentCreateInput = await request.json()

    // Validation
    if (!body.title || !body.thumbnail || !body.type || !body.creatorId) {
      return NextResponse.json(
        { error: 'Title, thumbnail, type and creatorId are required' },
        { status: 400 }
      )
    }

    // Vérifier si le créateur existe
    const creatorExists = await prisma.user.findUnique({
      where: { id: body.creatorId }
    })

    if (!creatorExists) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      )
    }

    // Créer le contenu
    const content = await prisma.content.create({
      data: {
        title: body.title,
        description: body.description,
        thumbnail: body.thumbnail,
        type: body.type,
        duration: body.duration,
        releaseDate: body.releaseDate ? new Date(body.releaseDate) : undefined,
        isExclusive: body.isExclusive || false,
        ageRestriction: body.ageRestriction,
        creatorId: body.creatorId,
        categories: body.categoryIds ? {
          connect: body.categoryIds.map(id => ({ id }))
        } : undefined,
        tags: body.tagIds ? {
          connect: body.tagIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    )
  }
}

// app/
//   api/
//     contents/
//       route.ts               // GET (liste) et POST
//       [id]/
//         route.ts             // GET (détail), PUT, DELETE
//         publish/
//           route.ts          // Endpoint pour publier/dépublier
//         featured/
//           route.ts          // Endpoint pour featured/unfeatured
//         media/
//           route.ts          // Gestion des médias associés
//         analytics/
//           route.ts          // Accès aux analytics
//         views/
//           route.ts          // Incrémentation des vues