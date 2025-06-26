import { NextResponse } from 'next/server'
import prisma  from "../../../../prisma/prisma"
// import { slugify } from '@/lib/utils'

// Types
interface CategoryCreateInput {
  name: string
  description?: string
  icon?: string
  isActive?: boolean
  order?: number
}

// GET - Récupérer toutes les catégories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const where = {
      ...(activeOnly && { isActive: true })
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: [
        { order: 'asc' }, // Ordonner par position
        { name: 'asc' }   // Puis par nom
      ],
      include: {
        _count: {
          select: {
            contents: true
          }
        }
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle catégorie
export async function POST(request: Request) {
  try {
    const body: CategoryCreateInput = await request.json()

    // Validation
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Vérifier si la catégorie existe déjà
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: body.name },
          // { slug: slugify(body.name) }
        ]
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name or slug already exists' },
        { status: 409 }
      )
    }

    // Créer la catégorie
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.name
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, ''),
        // slug: slugify(body.name),
        description: body.description,
        icon: body.icon,
        isActive: body.isActive ?? true,
        order: body.order
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

// app/
//   api/
//     categories/
//       route.ts               // GET (liste) et POST
//       [id]/
//         route.ts             // GET (détail), PUT, DELETE
//       slug/
//         [slug]/
//           route.ts           // GET par slug
//       reorder/
//         route.ts             // POST pour réordonner les catégories