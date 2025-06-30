// app/api/posts/create/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '../../../../prisma/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Gestion des hashtags
    const hashtagConnections = data.hashtags?.map((name: string) => ({
      where: { name },
      create: { name },
    }))

    const post = await prisma.post.create({
      data: {
        caption: data.caption,
        videoUrl: data.videoUrl,
        thumbnail: data.thumbnail,
        duration: data.duration,
        authorId: data.authorId,
        isPublic: data.isPublic ?? true,
        allowComments: data.allowComments ?? true,
        allowDuets: data.allowDuets ?? true,
        allowDownloads: data.allowDownloads ?? false,
        location: data.location,
        scheduledAt: data.scheduledAt,
        hashtags: {
          connectOrCreate: hashtagConnections,
        },
      },
      include: {
        author: true,
        hashtags: true,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}