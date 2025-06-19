// app/api/unfollow/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../../prisma/prisma"

export async function DELETE(req: Request) {
  const data = await req.json();

  const { followerId, followingId } = data;

  if (!followerId || !followingId) {
    return NextResponse.json(
      { error: 'followerId and followingId are required' },
      { status: 400 }
    );
  }

  try {
    const unfollow = await prisma.follow.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });

    return NextResponse.json({
      message: `Unfollowed user`,
      count: unfollow.count,
    });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json(
      { error: 'Failed to unfollow user' },
      { status: 500 }
    );
  }
}
