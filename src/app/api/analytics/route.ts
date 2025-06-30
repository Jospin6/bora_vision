// app/api/analytics/update/route.ts
import prisma from '../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, type } = await request.json()

    // Trouver ou créer l'analyse utilisateur
    let analytics = await prisma.userAnalytic.findFirst({
      where: { userId }
    })

    if (!analytics) {
      analytics = await prisma.userAnalytic.create({
        data: { userId }
      })
    }

    // Mettre à jour les statistiques en fonction du type d'événement
    const updateData: any = {}
    switch (type) {
      case 'VIEW':
        updateData.totalViews = { increment: 1 }
        break
      case 'LIKE':
        updateData.totalLikes = { increment: 1 }
        break
      case 'FOLLOW':
        updateData.totalFollowers = { increment: 1 }
        break
      case 'UNFOLLOW':
        updateData.totalFollowers = { decrement: 1 }
        break
    }

    // Recalculer le taux d'engagement
    if (type === 'LIKE' || type === 'VIEW') {
      const posts = await prisma.post.count({
        where: { authorId: userId }
      })

      if (posts > 0) {
        updateData.engagementRate = {
          set: (analytics.totalLikes + (type === 'LIKE' ? 1 : 0)) / posts
        }
      }
    }

    const updatedAnalytics = await prisma.userAnalytic.updateMany({
      where: { userId },
      data: updateData
    })

    return NextResponse.json(updatedAnalytics)
  } catch (error) {
    console.error('Error updating analytics:', error)
    return NextResponse.json(
      { error: 'Failed to update analytics' },
      { status: 500 }
    )
  }
}