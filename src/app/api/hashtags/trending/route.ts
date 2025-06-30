// app/api/hashtags/trending/route.ts
import prisma from '../../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Hashtags avec le plus de posts récemment
    const trendingHashtags = await prisma.hashtag.findMany({
      orderBy: {
        posts: {
          _count: 'desc'
        }
      },
      take: limit,
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    // Mettre à jour le trendRank (optionnel)
    await Promise.all(
      trendingHashtags.map((hashtag: any, index: number) =>
        prisma.hashtag.update({
          where: { id: hashtag.id },
          data: { trendRank: index + 1 }
        })
      )
    )

    return NextResponse.json(trendingHashtags)
  } catch (error) {
    console.error('Error fetching trending hashtags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending hashtags' },
      { status: 500 }
    )
  }
}