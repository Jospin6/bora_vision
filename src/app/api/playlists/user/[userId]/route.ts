import { NextResponse } from 'next/server'
import prisma  from "../../../../../../prisma/prisma"

// GET - Récupérer les playlists d'un utilisateur
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const includePrivate = searchParams.get('includePrivate') === 'true'

    // Vérifier si l'utilisateur existe
    const userExists = await prisma.user.findUnique({
      where: { id: params.userId }
    })

    if (!userExists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Vérifier si l'utilisateur demandeur est le propriétaire
    // (À implémenter selon votre système d'authentification)
    // const isOwner = currentUserId === params.userId

    const playlists = await prisma.playlist.findMany({
      where: {
        ownerId: params.userId,
        // ...(!isOwner && { isPublic: true }) // Ne montrer que les publiques si ce n'est pas le propriétaire
        ...(!includePrivate && { isPublic: true })
      },
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
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
      { error: 'Failed to fetch user playlists' },
      { status: 500 }
    )
  }
}