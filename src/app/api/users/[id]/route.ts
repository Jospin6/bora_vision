import { NextResponse, NextRequest } from 'next/server'
import prisma  from "../../../../../prisma/prisma"

// GET - Récupérer un utilisateur spécifique
export async function GET(
  request: NextRequest
) {
  const url = new URL(request.url)
  const id = url.pathname.split('/').pop() as string
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        _count: {
          select: {
            createdContents: true,
            playlists: true,
            favorites: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un utilisateur
export async function PUT(
  request: NextRequest
) {
  const url = new URL(request.url)
  const id = url.pathname.split('/').pop() as string
  try {
    const body = await request.json()

    // Ne pas permettre la mise à jour de certains champs
    if (body.password || body.email || body.role) {
      return NextResponse.json(
        { error: 'Cannot update password, email or role with this endpoint' },
        { status: 403 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        avatar: body.avatar,
        bio: body.bio
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        role: true,
        updatedAt: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(
  request: NextRequest
) {
  const url = new URL(request.url)
  const id = url.pathname.split('/').pop() as string
  try {
    // Vérifier d'abord si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id: id }
    })

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}