import { NextResponse } from 'next/server'
import prisma  from "../../../../../prisma/prisma"

// GET - Récupérer les tags les plus populaires
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const popularTags = await prisma.tag.findMany({
      take: limit,
      orderBy: {
        contents: {
          _count: 'desc'
        }
      },
      include: {
        _count: {
          select: {
            contents: true
          }
        }
      }
    })

    return NextResponse.json(popularTags)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch popular tags' },
      { status: 500 }
    )
  }
}