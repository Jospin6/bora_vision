// app/api/notifications/count/[userId]/route.ts
import prisma from '../../../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const count = await prisma.notification.count({
      where: {
        userId: params.userId,
        isRead: false
      }
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting unread notifications:', error)
    return NextResponse.json(
      { error: 'Failed to count notifications' },
      { status: 500 }
    )
  }
}