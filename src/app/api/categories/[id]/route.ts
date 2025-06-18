import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { slugify } from '@/lib/utils'

// GET - Récupérer une catégorie spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        contents: {
          take: 10, // Limiter les contenus retournés
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            title: true,
            thumbnail: true,
            type: true,
            views: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            contents: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour complètement une catégorie
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Vérifier si la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Vérifier si le nouveau nom est déjà utilisé
    if (body.name && body.name !== existingCategory.name) {
      const nameExists = await prisma.category.findFirst({
        where: {
          OR: [
            { name: body.name },
            { slug: slugify(body.name) }
          ],
          NOT: {
            id: params.id
          }
        }
      })

      if (nameExists) {
        return NextResponse.json(
          { error: 'Category with this name or slug already exists' },
          { status: 409 }
        )
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: body.name,
        slug: body.name ? slugify(body.name) : undefined,
        description: body.description,
        icon: body.icon,
        isActive: body.isActive,
        order: body.order
      }
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier d'abord si la catégorie existe
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            contents: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Empêcher la suppression si la catégorie contient des contenus
    if (category._count.contents > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with associated contents' },
        { status: 400 }
      )
    }

    // Supprimer la catégorie
    await prisma.category.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}