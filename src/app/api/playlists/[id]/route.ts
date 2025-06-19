import { NextResponse } from 'next/server'
import prisma  from "../../../../../prisma/prisma"

// GET - Récupérer une playlist spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        items: {
          orderBy: {
            order: 'asc'
          },
          include: {
            content: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                type: true,
                duration: true,
                views: true
              }
            }
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      }
    })

    if (!playlist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      )
    }

    // Vérifier si la playlist est publique ou si l'utilisateur est le propriétaire
    // (À implémenter selon votre système d'authentification)
    // if (!playlist.isPublic && !isOwner) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 403 }
    //   )
    // }

    return NextResponse.json(playlist)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch playlist' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour complètement une playlist
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Vérifier si la playlist existe
    const existingPlaylist = await prisma.playlist.findUnique({
      where: { id: params.id }
    })

    if (!existingPlaylist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est le propriétaire
    // (À implémenter selon votre système d'authentification)
    // if (!isOwner) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 403 }
    //   )
    // }

    const updatedPlaylist = await prisma.playlist.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        isPublic: body.isPublic
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })

    return NextResponse.json(updatedPlaylist)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update playlist' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une playlist
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier d'abord si la playlist existe
    const playlist = await prisma.playlist.findUnique({
      where: { id: params.id }
    })

    if (!playlist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est le propriétaire
    // (À implémenter selon votre système d'authentification)
    // if (!isOwner) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 403 }
    //   )
    // }

    // Supprimer la playlist (les items seront automatiquement supprimés via cascade)
    await prisma.playlist.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Playlist deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete playlist' },
      { status: 500 }
    )
  }
}