import { NextResponse } from 'next/server'
import prisma  from "../../../../../prisma/prisma"

// GET - Récupérer un contenu spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const content = await prisma.content.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatar: true,
            bio: true
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        media: {
          select: {
            id: true,
            url: true,
            format: true,
            quality: true,
            duration: true
          },
          orderBy: {
            quality: 'desc'
          }
        },
        _count: {
          select: {
            favorites: true,
            comments: true,
            views: true
          }
        }
      }
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour complètement un contenu
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Vérifier si le contenu existe
    const existingContent = await prisma.content.findUnique({
      where: { id: params.id }
    })

    if (!existingContent) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    const updatedContent = await prisma.content.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        thumbnail: body.thumbnail,
        type: body.type,
        duration: body.duration,
        releaseDate: body.releaseDate ? new Date(body.releaseDate) : null,
        isExclusive: body.isExclusive,
        ageRestriction: body.ageRestriction,
        metadata: body.metadata,
        categories: body.categoryIds ? {
          set: body.categoryIds.map((id: any) => ({ id }))
        } : undefined,
        tags: body.tagIds ? {
          set: body.tagIds.map((id: any) => ({ id }))
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

    return NextResponse.json(updatedContent)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un contenu
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier d'abord si le contenu existe
    const content = await prisma.content.findUnique({
      where: { id: params.id }
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // Supprimer le contenu (les relations seront gérées par Prisma selon les règles de suppression)
    await prisma.content.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Content deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    )
  }
}