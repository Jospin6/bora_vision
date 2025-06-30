// app/api/views/post/[postId]/route.ts
import prisma from '../../../../../../prisma/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    // Compter le nombre total de vues
    const totalViews = await prisma.view.count({
      where: { postId: params.postId }
    })

    // Compter les vues uniques (par utilisateur)
    const uniqueViewers = await prisma.view.groupBy({
      by: ['viewerId'],
      where: { 
        postId: params.postId,
        viewerId: { not: null }
      },
      _count: true
    })

    // Durée moyenne de visionnage
    const avgDuration = await prisma.view.aggregate({
      where: { 
        postId: params.postId,
        duration: { not: null }
      },
      _avg: { duration: true }
    })

    // Répartition par pays
    const byCountry = await prisma.view.groupBy({
      by: ['country'],
      where: { 
        postId: params.postId,
        country: { not: null }
      },
      _count: true
    })

    // Répartition par appareil
    const byDevice = await prisma.view.groupBy({
      by: ['device'],
      where: { 
        postId: params.postId,
        device: { not: null }
      },
      _count: true
    })

    return NextResponse.json({
      totalViews,
      uniqueViewers: uniqueViewers.length,
      avgDuration: avgDuration._avg.duration,
      byCountry,
      byDevice
    })
  } catch (error) {
    console.error('Error fetching view stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch view stats' },
      { status: 500 }
    )
  }
}