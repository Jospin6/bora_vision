import { NextResponse } from 'next/server'
import prisma  from "../../../../prisma/prisma"
// import { slugify } from '@/lib/utils'

// Types
interface TagCreateInput {
  name: string
}

// GET - Récupérer tous les tags
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const query = searchParams.get('query')

    const where = {
      ...(query && {
        name: {
          contains: query,
          mode: 'insensitive' as const
        }
      })
    }

    const tags = await prisma.tag.findMany({
      where,
      take: limit,
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: {
            contents: true
          }
        }
      }
    })

    return NextResponse.json(tags)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau tag
export async function POST(request: Request) {
  try {
    const body: TagCreateInput = await request.json()

    // Validation
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Vérifier si le tag existe déjà
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [
          { name: body.name },
          // { slug: slugify(body.name) }
        ]
      }
    })

    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag with this name or slug already exists' },
        { status: 409 }
      )
    }

    // Créer le tag
    const tag = await prisma.tag.create({
      data: {
        name: body.name,
        // slug: slugify(body.name)
      }
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}

// app/
//   api/
//     tags/
//       route.ts               // GET (liste) et POST
//       [id]/
//         route.ts             // GET (détail), PUT, DELETE
//       slug/
//         [slug]/
//           route.ts           // GET par slug
//       popular/
//         route.ts             // GET tags les plus populaires