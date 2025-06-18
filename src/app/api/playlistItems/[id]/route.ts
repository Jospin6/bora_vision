import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Types
interface PlaylistItemCreateInput {
  playlistId: string
  contentId: string
  order?: number
}

// POST - Ajouter un contenu à une playlist
export async function POST(request: Request) {
  try {
    const body: PlaylistItemCreateInput = await request.json()

    // Validation
    if (!body.playlistId || !body.contentId) {
      return NextResponse.json(
        { error: 'playlistId and contentId are required' },
        { status: 400 }
      )
    }

    // Vérifier si la playlist existe
    const playlist = await prisma.playlist.findUnique({
      where: { id: body.playlistId }
    })

    if (!playlist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      )
    }

    // Vérifier si le contenu existe
    const content = await prisma.content.findUnique({
      where: { id: body.contentId }
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // Vérifier si le contenu est déjà dans la playlist
    const existingItem = await prisma.playlistItem.findFirst({
      where: {
        playlistId: body.playlistId,
        contentId: body.contentId
      }
    })

    if (existingItem) {
      return NextResponse.json(
        { error: 'Content already exists in playlist' },
        { status: 409 }
      )
    }

    // Déterminer l'ordre (dernier si non spécifié)
    let order = body.order
    if (!order) {
      const lastItem = await prisma.playlistItem.findFirst({
        where: { playlistId: body.playlistId },
        orderBy: { order: 'desc' },
        select: { order: true }
      })
      order = lastItem ? lastItem.order + 1 : 1
    } else {
      // Décaller les items existants si nécessaire
      await prisma.playlistItem.updateMany({
        where: {
          playlistId: body.playlistId,
          order: { gte: order }
        },
        data: {
          order: { increment: 1 }
        }
      })
    }

    // Créer l'item
    const playlistItem = await prisma.playlistItem.create({
      data: {
        playlistId: body.playlistId,
        contentId: body.contentId,
        order: order
      },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            thumbnail: true
          }
        },
        playlist: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(playlistItem, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add item to playlist' },
      { status: 500 }
    )
  }
}