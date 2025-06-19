// app/api/comments/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../prisma/prisma"

export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        parentId: null, // On ne récupère que les "top-level" comments
      },
      include: {
        user: true,
        replies: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const newComment = await prisma.comment.create({
      data: {
        userId: data.userId,
        contentId: data.contentId,
        text: data.text,
        parentId: data.parentId || null,
      },
      include: {
        user: true,
        replies: true,
      },
    });

    return NextResponse.json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
