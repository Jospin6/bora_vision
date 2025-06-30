// app/api/analytics/leaderboard/route.ts
import prisma from '../../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'engagementRate'

    const leaderboard = await prisma.userAnalytic.findMany({
      orderBy: {
        [sortBy]: 'desc'
      },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      },
      where: {
        user: {
          role: 'CONTENT_CREATOR' // Filtrer seulement les créateurs si nécessaire
        }
      }
    })

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}