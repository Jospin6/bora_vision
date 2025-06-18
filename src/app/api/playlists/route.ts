import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Types
interface PlaylistCreateInput {
  name: string
  description?: string
  isPublic?: boolean
  ownerId: string
}

// GET - Récupérer toutes les playlists publiques
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || 'updatedAt_desc'

    const [sortField, sortOrder] = sort.split('_')

    const playlists = await prisma.playlist.findMany({
      where: {
        isPublic: true
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortField]: sortOrder
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      }
    })

    return NextResponse.json(playlists)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch public playlists' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle playlist
export async function POST(request: Request) {
  try {
    const body: PlaylistCreateInput = await request.json()

    // Validation
    if (!body.name || !body.ownerId) {
      return NextResponse.json(
        { error: 'Name and ownerId are required' },
        { status: 400 }
      )
    }

    // Vérifier si l'owner existe
    const ownerExists = await prisma.user.findUnique({
      where: { id: body.ownerId }
    })

    if (!ownerExists) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      )
    }

    // Créer la playlist
    const playlist = await prisma.playlist.create({
      data: {
        name: body.name,
        description: body.description,
        isPublic: body.isPublic || false,
        ownerId: body.ownerId
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

    return NextResponse.json(playlist, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create playlist' },
      { status: 500 }
    )
  }
}

// app/
//   api/
//     playlists/
//       route.ts               // GET (liste) et POST
//       [id]/
//         route.ts             // GET (détail), PUT, DELETE
//       user/
//         [userId]/
//           route.ts           // GET playlists d'un utilisateur
//       items/
//         [id]/
//           route.ts           // Gestion des items de playlist