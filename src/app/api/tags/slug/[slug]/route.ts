import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Récupérer un tag par son slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { slug: params.slug },
      include: {
        contents: {
          where: {
            status: 'PUBLISHED'
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 20,
          select: {
            id: true,
            title: true,
            thumbnail: true,
            type: true,
            views: true,
            createdAt: true,
            duration: true
          }
        },
        _count: {
          select: {
            contents: {
              where: {
                status: 'PUBLISHED'
              }
            }
          }
        }
      }
    })

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(tag)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tag by slug' },
      { status: 500 }
    )
  }
}