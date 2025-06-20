import { NextResponse } from 'next/server'
import prisma  from "../../../../../prisma/prisma"

// GET - Vérifier si un contenu est dans les favoris d'un utilisateur
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const contentId = searchParams.get('contentId')

    if (!userId || !contentId) {
      return NextResponse.json(
        { error: 'userId and contentId are required' },
        { status: 400 }
      )
    }

    const favorite = await prisma.favorite.findFirst({
      where: {
        userId,
        contentId
      },
      select: {
        id: true
      }
    })

    return NextResponse.json({
      isFavorite: !!favorite,
      favoriteId: favorite?.id || null
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check favorite status' },
      { status: 500 }
    )
  }
}