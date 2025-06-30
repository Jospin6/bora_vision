// app/api/analytics/user/[userId]/route.ts
import prisma from '../../../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const analytics = await prisma.userAnalytic.findFirst({
      where: { userId: params.userId },
      include: {
        user: true
      }
    })

    if (!analytics) {
      return NextResponse.json(
        { error: 'Analytics not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching user analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}