import { NextResponse } from 'next/server'
import prisma  from "../../../../../prisma/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json()

    if (!action || (action !== 'publish' && action !== 'unpublish')) {
      return NextResponse.json(
        { error: 'Invalid action. Use "publish" or "unpublish"' },
        { status: 400 }
      )
    }

    // Vérifier si le contenu existe
    const content = await prisma.content.findUnique({
      where: { id: params.id }
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    const updatedContent = await prisma.content.update({
      where: { id: params.id },
      data: {
        status: action === 'publish' ? 'PUBLISHED' : 'DRAFT'
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })

    return NextResponse.json(updatedContent)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update content status' },
      { status: 500 }
    )
  }
}