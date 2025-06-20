import { NextResponse } from 'next/server'
import prisma  from "../../../../../prisma/prisma"

// GET - Récupérer un favori spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: { id: params.id },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            type: true
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(favorite)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch favorite' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un favori
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier d'abord si le favori existe
    const favorite = await prisma.favorite.findUnique({
      where: { id: params.id }
    })

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    // Supprimer le favori
    await prisma.favorite.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Favorite removed successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete favorite' },
      { status: 500 }
    )
  }
}