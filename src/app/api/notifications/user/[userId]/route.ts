// app/api/notifications/user/[userId]/route.ts
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
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const notifications = await prisma.notification.findMany({
      where: {
        userId: params.userId,
        ...(unreadOnly && { isRead: false })
      },
      include: {
        post: {
          include: {
            author: true
          }
        },
        sender: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit
    })

    const total = await prisma.notification.count({
      where: {
        userId: params.userId,
        ...(unreadOnly && { isRead: false })
      }
    })

    return NextResponse.json({
      data: notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}