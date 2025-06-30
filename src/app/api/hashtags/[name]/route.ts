// app/api/hashtags/[name]/route.ts
import prisma from '../../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')

    const hashtag = await prisma.hashtag.findUnique({
      where: { name: params.name },
      include: {
        posts: {
          include: {
            author: true,
            _count: {
              select: {
                likes: true,
                comments: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: (page - 1) * limit
        }
      }
    })

    if (!hashtag) {
      return NextResponse.json(
        { error: 'Hashtag not found' },
        { status: 404 }
      )
    }

    const totalPosts = await prisma.post.count({
      where: {
        hashtags: {
          some: { name: params.name }
        }
      }
    })

    return NextResponse.json({
      ...hashtag,
      totalPosts,
      page,
      totalPages: Math.ceil(totalPosts / limit)
    })
  } catch (error) {
    console.error('Error fetching hashtag:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hashtag' },
      { status: 500 }
    )
  }
}