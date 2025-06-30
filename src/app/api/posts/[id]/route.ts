// app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '../../../../../prisma/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: true,
        hashtags: true,
        likes: true,
        comments: {
          include: {
            author: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            views: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// app/api/posts/[id]/route.ts
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    // D'abord dissocier tous les hashtags existants
    await prisma.post.update({
      where: { id: params.id },
      data: {
        hashtags: {
          set: [],
        },
      },
    })

    // Puis connecter/créer les nouveaux hashtags
    const hashtagConnections = data.hashtags?.map((name: string) => ({
      where: { name },
      create: { name },
    }))

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        caption: data.caption,
        isPublic: data.isPublic,
        allowComments: data.allowComments,
        allowDuets: data.allowDuets,
        allowDownloads: data.allowDownloads,
        location: data.location,
        hashtags: {
          connectOrCreate: hashtagConnections,
        },
      },
      include: {
        hashtags: true,
      },
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}