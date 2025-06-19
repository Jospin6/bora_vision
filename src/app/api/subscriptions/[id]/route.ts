import { NextResponse } from 'next/server'
import prisma  from "../../../../../prisma/prisma"

// GET - Récupérer une subscription spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(subscription)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour complètement une subscription
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Vérifier si la subscription existe
    const existingSub = await prisma.subscription.findUnique({
      where: { id: params.id }
    })

    if (!existingSub) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: params.id },
      data: {
        plan: body.plan,
        endDate: body.endDate ? new Date(body.endDate) : null,
        isActive: body.isActive,
        autoRenew: body.autoRenew,
        paymentMethodId: body.paymentMethodId,
        lastPaymentDate: body.lastPaymentDate ? new Date(body.lastPaymentDate) : null,
        nextBillingDate: body.nextBillingDate ? new Date(body.nextBillingDate) : null
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

    return NextResponse.json(updatedSubscription)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour partiellement une subscription
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Vérifier si la subscription existe
    const existingSub = await prisma.subscription.findUnique({
      where: { id: params.id }
    })

    if (!existingSub) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: params.id },
      data: {
        ...(body.plan && { plan: body.plan }),
        ...(body.endDate && { endDate: new Date(body.endDate) }),
        ...(typeof body.isActive === 'boolean' && { isActive: body.isActive }),
        ...(typeof body.autoRenew === 'boolean' && { autoRenew: body.autoRenew }),
        ...(body.paymentMethodId && { paymentMethodId: body.paymentMethodId }),
        ...(body.lastPaymentDate && { lastPaymentDate: new Date(body.lastPaymentDate) }),
        ...(body.nextBillingDate && { nextBillingDate: new Date(body.nextBillingDate) })
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

    return NextResponse.json(updatedSubscription)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une subscription
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier d'abord si la subscription existe
    const subscription = await prisma.subscription.findUnique({
      where: { id: params.id }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Supprimer la subscription
    await prisma.subscription.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Subscription deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete subscription' },
      { status: 500 }
    )
  }
}