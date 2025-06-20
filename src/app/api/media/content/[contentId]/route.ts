import { NextResponse } from 'next/server'
import prisma  from "../../../../../../prisma/prisma"

// GET - Récupérer tous les médias d'un contenu
export async function GET(
  request: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    // Vérifier si le contenu existe
    const contentExists = await prisma.content.findUnique({
      where: { id: params.contentId }
    })

    if (!contentExists) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    const mediaList = await prisma.media.findMany({
      where: { contentId: params.contentId },
      orderBy: [
        { isDefault: 'desc' }, // Média par défaut en premier
        { quality: 'desc' }    // Meilleure qualité ensuite
      ],
      select: {
        id: true,
        url: true,
        format: true,
        quality: true,
        bitrate: true,
        size: true,
        duration: true,
        isDefault: true,
        createdAt: true,
        uploader: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })

    return NextResponse.json(mediaList)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch content media' },
      { status: 500 }
    )
  }
}