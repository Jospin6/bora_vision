import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Récupérer un média spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const media = await prisma.media.findUnique({
      where: { id: params.id },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            type: true
          }
        },
        uploader: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(media)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour complètement un média
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Vérifier si le média existe
    const existingMedia = await prisma.media.findUnique({
      where: { id: params.id }
    })

    if (!existingMedia) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    // Ne pas permettre la modification de certains champs
    if (body.contentId || body.uploaderId) {
      return NextResponse.json(
        { error: 'Cannot change contentId or uploaderId' },
        { status: 403 }
      )
    }

    const updatedMedia = await prisma.media.update({
      where: { id: params.id },
      data: {
        url: body.url,
        format: body.format,
        quality: body.quality,
        bitrate: body.bitrate,
        size: body.size,
        duration: body.duration
      },
      include: {
        content: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json(updatedMedia)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update media' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un média
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier d'abord si le média existe
    const media = await prisma.media.findUnique({
      where: { id: params.id }
    })

    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    // Vérifier si c'est le média par défaut
    if (media.isDefault) {
      // Trouver un autre média du même contenu pour le remplacer
      const otherMedia = await prisma.media.findFirst({
        where: {
          contentId: media.contentId,
          id: { not: media.id }
        }
      })

      if (otherMedia) {
        await prisma.media.update({
          where: { id: otherMedia.id },
          data: { isDefault: true }
        })
      }
    }

    // Supprimer le média
    await prisma.media.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Media deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}