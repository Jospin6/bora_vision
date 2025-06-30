// app/api/bookmarks/toggle/route.ts
import prisma from '../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, postId } = await request.json()

    // Vérifier si le bookmark existe déjà
    const existingBookmark = await prisma.bookmark.findFirst({
      where: { userId, postId }
    })

    const bookmark = existingBookmark
      ? await prisma.bookmark.delete({
          where: { id: existingBookmark.id }
        })
      : await prisma.bookmark.create({
          data: { userId, postId }
        })

    return NextResponse.json({
      bookmarked: !existingBookmark
    })
  } catch (error) {
    console.error('Error toggling bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to toggle bookmark' },
      { status: 500 }
    )
  }
}