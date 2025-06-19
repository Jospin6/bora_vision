import { NextResponse } from 'next/server'
import prisma  from "../../../../../prisma/prisma"

interface ReorderRequest {
  playlistId: string
  newOrder: { id: string; order: number }[]
}

// POST - Réordonner les items d'une playlist
export async function POST(request: Request) {
  try {
    const { playlistId, newOrder }: ReorderRequest = await request.json()

    if (!playlistId || !newOrder || !Array.isArray(newOrder)) {
      return NextResponse.json(
        { error: 'playlistId and newOrder array are required' },
        { status: 400 }
      )
    }

    // Vérifier si la playlist existe
    const playlistExists = await prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { id: true }
    })

    if (!playlistExists) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      )
    }

    // Vérifier que tous les items appartiennent à la playlist
    const itemsCount = await prisma.playlistItem.count({
      where: {
        playlistId,
        id: { in: newOrder.map(item => item.id) }
      }
    })

    if (itemsCount !== newOrder.length) {
      return NextResponse.json(
        { error: 'One or more items do not belong to this playlist' },
        { status: 400 }
      )
    }

    // Mettre à jour l'ordre dans une transaction
    const updates = newOrder.map(item =>
      prisma.playlistItem.update({
        where: { id: item.id },
        data: { order: item.order }
      })
    )

    await prisma.$transaction(updates)

    return NextResponse.json(
      { message: 'Playlist items reordered successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to reorder playlist items' },
      { status: 500 }
    )
  }
}