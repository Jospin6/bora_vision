// app/api/topics/trending/route.ts
import prisma from '../../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const trendingTopics = await prisma.topic.findMany({
      orderBy: [
        {
          posts: {
            _count: 'desc'
          }
        },
        {
          User: {
            _count: 'desc'
          }
        }
      ],
      take: limit,
      include: {
        _count: {
          select: {
            posts: true,
            User: true
          }
        }
      }
    })

    return NextResponse.json(trendingTopics)
  } catch (error) {
    console.error('Error fetching trending topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending topics' },
      { status: 500 }
    )
  }
}