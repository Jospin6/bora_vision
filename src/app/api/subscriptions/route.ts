import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { SubscriptionPlan } from '@prisma/client'

// Types
interface SubscriptionCreateInput {
  userId: string
  plan: SubscriptionPlan
  endDate?: string
  autoRenew?: boolean
  paymentMethodId?: string
}

// GET - Récupérer toutes les subscriptions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const plan = searchParams.get('plan') as SubscriptionPlan | undefined
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const where = {
      ...(plan && { plan }),
      ...(activeOnly && { isActive: true })
    }

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true
            }
          }
        },
        orderBy: {
          startDate: 'desc'
        }
      }),
      prisma.subscription.count({ where })
    ])

    return NextResponse.json({
      data: subscriptions,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle subscription
export async function POST(request: Request) {
  try {
    const body: SubscriptionCreateInput = await request.json()

    // Validation
    if (!body.userId || !body.plan) {
      return NextResponse.json(
        { error: 'userId and plan are required' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe
    const userExists = await prisma.user.findUnique({
      where: { id: body.userId }
    })

    if (!userExists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Créer la subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: body.userId,
        plan: body.plan,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        autoRenew: body.autoRenew || false,
        paymentMethodId: body.paymentMethodId,
        nextBillingDate: body.autoRenew ? calculateNextBillingDate(body.plan) : undefined
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}

// Helper function to calculate next billing date based on plan
function calculateNextBillingDate(plan: SubscriptionPlan): Date {
  const date = new Date()
  switch (plan) {
    case 'MONTHLY':
      date.setMonth(date.getMonth() + 1)
      break
    case 'YEARLY':
      date.setFullYear(date.getFullYear() + 1)
      break
    case 'QUARTERLY':
      date.setMonth(date.getMonth() + 3)
      break
    default: // FREE
      date.setMonth(date.getMonth() + 1)
  }
  return date
}