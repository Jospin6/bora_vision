import { NextResponse } from 'next/server'
import prisma  from "../../../../../../prisma/prisma"

// Types
interface PlaylistItemUpdate {
  order?: number
  contentId?: string
}

// GET - Récupérer un item de playlist
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.playlistItem.findUnique({
      where: { id: params.id },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            type: true,
            duration: true
          }
        },
        playlist: {
          select: {
            id: true,
            name: true,
            ownerId: true
          }
        }
      }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Playlist item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch playlist item' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un item de playlist
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body: PlaylistItemUpdate = await request.json()

    // Vérifier si l'item existe
    const existingItem = await prisma.playlistItem.findUnique({
      where: { id: params.id },
      include: {
        playlist: {
          select: {
            ownerId: true
          }
        }
      }
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Playlist item not found' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est le propriétaire de la playlist
    // (À implémenter selon votre système d'authentification)
    // if (!isOwner) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 403 }
    //   )
    // }

    // Si on change le contentId, vérifier que le contenu existe
    if (body.contentId) {
      const contentExists = await prisma.content.findUnique({
        where: { id: body.contentId }
      })

      if (!contentExists) {
        return NextResponse.json(
          { error: 'Content not found' },
          { status: 404 }
        )
      }
    }

    const updatedItem = await prisma.playlistItem.update({
      where: { id: params.id },
      data: {
        order: body.order,
        contentId: body.contentId
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

    return NextResponse.json(updatedItem)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update playlist item' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un item de playlist
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier d'abord si l'item existe
    const item = await prisma.playlistItem.findUnique({
      where: { id: params.id },
      include: {
        playlist: {
          select: {
            ownerId: true
          }
        }
      }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Playlist item not found' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est le propriétaire de la playlist
    // (À implémenter selon votre système d'authentification)
    // if (!isOwner) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 403 }
    //   )
    // }

    // Supprimer l'item
    await prisma.playlistItem.delete({
      where: { id: params.id }
    })

    // Réorganiser l'ordre des items restants
    await prisma.$executeRaw`
      UPDATE "PlaylistItem"
      SET "order" = "order" - 1
      WHERE "playlistId" = ${item.playlistId} AND "order" > ${item.order}
    `

    return NextResponse.json(
      { message: 'Playlist item deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete playlist item' },
      { status: 500 }
    )
  }
}