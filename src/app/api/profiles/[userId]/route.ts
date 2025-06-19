import { NextResponse } from 'next/server'
import prisma  from "../../../../../prisma/prisma"

// GET - Récupérer un profil spécifique par userId
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: params.userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true
          }
        }
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un profil
export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json()

    // Validation des données
    if (body.userId || body.id) {
      return NextResponse.json(
        { error: 'Cannot update userId or id' },
        { status: 403 }
      )
    }

    // Vérifier si le profil existe
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: params.userId }
    })

    let updatedProfile

    if (existingProfile) {
      // Mettre à jour le profil existant
      updatedProfile = await prisma.profile.update({
        where: { userId: params.userId },
        data: {
          displayName: body.displayName,
          profilePicture: body.profilePicture,
          coverPhoto: body.coverPhoto,
          country: body.country,
          language: body.language,
          birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
          gender: body.gender,
          website: body.website,
          socialLinks: body.socialLinks,
          preferences: body.preferences
        },
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        }
      })
    } else {
      // Créer un nouveau profil si aucun n'existe (bien que le modèle l'exige normalement)
      updatedProfile = await prisma.profile.create({
        data: {
          userId: params.userId,
          displayName: body.displayName,
          profilePicture: body.profilePicture,
          coverPhoto: body.coverPhoto,
          country: body.country,
          language: body.language,
          birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
          gender: body.gender,
          website: body.website,
          socialLinks: body.socialLinks,
          preferences: body.preferences
        },
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        }
      })
    }

    return NextResponse.json(updatedProfile)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}