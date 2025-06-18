import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { slugify } from '@/lib/utils'

// GET - Récupérer un tag spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tag = await prisma.tag.findUnique({
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

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(tag)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour complètement un tag
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Vérifier si le tag existe
    const existingTag = await prisma.tag.findUnique({
      where: { id: params.id }
    })

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    // Vérifier si le nouveau nom est déjà utilisé
    if (body.name && body.name !== existingTag.name) {
      const nameExists = await prisma.tag.findFirst({
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
          { error: 'Tag with this name or slug already exists' },
          { status: 409 }
        )
      }
    }

    const updatedTag = await prisma.tag.update({
      where: { id: params.id },
      data: {
        name: body.name,
        slug: body.name ? slugify(body.name) : undefined
      }
    })

    return NextResponse.json(updatedTag)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un tag
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier d'abord si le tag existe
    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            contents: true
          }
        }
      }
    })

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    // Supprimer le tag (les relations seront automatiquement supprimées)
    await prisma.tag.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Tag deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    )
  }
}