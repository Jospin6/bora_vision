import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Types
interface FollowCreateInput {
  followerId: string
  followingId: string
}

// GET - Récupérer toutes les relations de suivi
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const followerId = searchParams.get('followerId')
    const followingId = searchParams.get('followingId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where = {
      ...(followerId && { followerId }),
      ...(followingId && { followingId })
    }

    const [follows, total] = await Promise.all([
      prisma.follow.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          },
          following: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          }
        }
      }),
      prisma.follow.count({ where })
    ])

    return NextResponse.json({
      data: follows,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch follows' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle relation de suivi
export async function POST(request: Request) {
  try {
    const body: FollowCreateInput = await request.json()

    // Validation
    if (!body.followerId || !body.followingId) {
      return NextResponse.json(
        { error: 'followerId and followingId are required' },
        { status: 400 }
      )
    }

    // Empêcher de se suivre soi-même
    if (body.followerId === body.followingId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Vérifier si le follower existe
    const followerExists = await prisma.user.findUnique({
      where: { id: body.followerId }
    })

    if (!followerExists) {
      return NextResponse.json(
        { error: 'Follower user not found' },
        { status: 404 }
      )
    }

    // Vérifier si le following existe
    const followingExists = await prisma.user.findUnique({
      where: { id: body.followingId }
    })

    if (!followingExists) {
      return NextResponse.json(
        { error: 'Following user not found' },
        { status: 404 }
      )
    }

    // Vérifier si le follow existe déjà
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: body.followerId,
        followingId: body.followingId
      }
    })

    if (existingFollow) {
      return NextResponse.json(
        { error: 'Already following this user' },
        { status: 409 }
      )
    }

    // Créer le follow
    const follow = await prisma.follow.create({
      data: {
        followerId: body.followerId,
        followingId: body.followingId
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true
          }
        },
        following: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })

    return NextResponse.json(follow, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create follow' },
      { status: 500 }
    )
  }
}