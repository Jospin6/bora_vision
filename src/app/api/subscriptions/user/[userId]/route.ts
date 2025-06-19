import { NextResponse } from 'next/server'
import prisma  from "../../../../../../prisma/prisma"

// GET - Récupérer les subscriptions d'un utilisateur spécifique
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const where = {
      userId: params.userId,
      ...(activeOnly && { isActive: true })
    }

    const subscriptions = await prisma.subscription.findMany({
      where,
      orderBy: {
        startDate: 'desc'
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

    // Retourner la subscription active en premier si elle existe
    const activeSubscription = subscriptions.find((sub: { isActive: any }) => sub.isActive)
    const sortedSubscriptions = activeSubscription
      ? [
          activeSubscription,
          ...subscriptions.filter((sub: { id: any }) => sub.id !== activeSubscription.id)
        ]
      : subscriptions

    return NextResponse.json(sortedSubscriptions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user subscriptions' },
      { status: 500 }
    )
  }
}