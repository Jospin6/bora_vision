import { NextResponse } from 'next/server'
import prisma  from "../../../../prisma/prisma"

// Types
interface UserCreateInput {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
  role?: "USER"
}

// GET - Récupérer tous les utilisateurs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const role = searchParams.get('role')

    const where = role ? { role: role as "USER" } : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        }
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      data: users,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}