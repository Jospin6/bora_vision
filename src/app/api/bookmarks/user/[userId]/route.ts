// app/api/bookmarks/user/[userId]/route.ts
import prisma from '../../../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: params.userId },
      include: {
        post: {
          include: {
            author: true,
            _count: {
              select: {
                likes: true,
                comments: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit
    })

    const total = await prisma.bookmark.count({
      where: { userId: params.userId }
    })

    return NextResponse.json({
      data: bookmarks,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    )
  }
}