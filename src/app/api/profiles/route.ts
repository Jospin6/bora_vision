import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Récupérer tous les profils (avec pagination)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const country = searchParams.get('country')
    const language = searchParams.get('language')

    const where = {
      ...(country && { country }),
      ...(language && { language })
    }

    const [profiles, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              role: true
            }
          }
        }
      }),
      prisma.profile.count({ where })
    ])

    return NextResponse.json({
      data: profiles,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    )
  }
}