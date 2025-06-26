import { NextResponse, NextRequest } from 'next/server'
import prisma  from "../../../../prisma/prisma"

// Types
interface MediaCreateInput {
  contentId: string
  url: string
  format: string
  quality?: string
  bitrate?: number
  size?: number
  duration?: number
  uploaderId: string
}

// POST - Créer un nouveau média
export async function POST(request: NextRequest) {
  try {
    const body: MediaCreateInput = await request.json()

    // Validation
    if (!body.contentId || !body.url || !body.format || !body.uploaderId) {
      return NextResponse.json(
        { error: 'contentId, url, format and uploaderId are required' },
        { status: 400 }
      )
    }

    // Vérifier si le contenu existe
    const contentExists = await prisma.content.findUnique({
      where: { id: body.contentId }
    })

    if (!contentExists) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // Vérifier si l'uploader existe
    const uploaderExists = await prisma.user.findUnique({
      where: { id: body.uploaderId }
    })

    if (!uploaderExists) {
      return NextResponse.json(
        { error: 'Uploader not found' },
        { status: 404 }
      )
    }

    // Créer le média
    const media = await prisma.media.create({
      data: {
        contentId: body.contentId,
        url: body.url,
        format: body.format,
        quality: body.quality,
        bitrate: body.bitrate,
        size: body.size,
        duration: body.duration,
        uploaderId: body.uploaderId,
        isDefault: false // Par défaut false, peut être changé ensuite
      },
      include: {
        content: {
          select: {
            id: true,
            title: true
          }
        },
        uploader: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create media' },
      { status: 500 }
    )
  }
}

// app/
//   api/
//     media/
//       route.ts               // POST (création)
//       [id]/
//         route.ts             // GET (détail), PUT, DELETE
//       content/
//         [contentId]/
//           route.ts           // GET tous les médias d'un contenu
//       set-default/
//         [id]/
//           route.ts  