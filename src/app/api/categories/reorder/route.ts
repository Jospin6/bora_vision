import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface ReorderRequest {
  ids: string[]
}

// POST - Réordonner les catégories
export async function POST(request: Request) {
  try {
    const { ids }: ReorderRequest = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid category ids array' },
        { status: 400 }
      )
    }

    // Vérifier que toutes les catégories existent
    const categoriesCount = await prisma.category.count({
      where: {
        id: { in: ids }
      }
    })

    if (categoriesCount !== ids.length) {
      return NextResponse.json(
        { error: 'One or more categories not found' },
        { status: 404 }
      )
    }

    // Mettre à jour l'ordre de toutes les catégories
    const transaction = ids.map((id, index) =>
      prisma.category.update({
        where: { id },
        data: { order: index + 1 } // Commence à 1
      })
    )

    await prisma.$transaction(transaction)

    return NextResponse.json(
      { message: 'Categories reordered successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to reorder categories' },
      { status: 500 }
    )
  }
}