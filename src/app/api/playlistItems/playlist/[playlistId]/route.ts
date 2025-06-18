import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Récupérer tous les items d'une playlist
export async function GET(
  request: Request,
  { params }: { params: { playlistId: string } }
) {
  try {
    // Vérifier si la playlist existe
    const playlist = await prisma.playlist.findUnique({
      where: { id: params.playlistId },
      select: { id: true, isPublic: true, ownerId: true }
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

    const items = await prisma.playlistItem.findMany({
      where: { playlistId: params.playlistId },
      orderBy: { order: 'asc' },
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
    })

    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch playlist items' },
      { status: 500 }
    )
  }
}