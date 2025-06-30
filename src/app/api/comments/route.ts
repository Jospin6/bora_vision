// app/api/comments/create/route.ts
import prisma from '../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, authorId, postId } = await request.json()

    const comment = await prisma.comment.create({
      data: {
        text,
        authorId,
        postId,
      },
      include: {
        author: true,
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}