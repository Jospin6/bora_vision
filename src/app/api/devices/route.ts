// app/api/devices/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const devices = await prisma.device.findMany({
      include: {
        user: true,
      },
      orderBy: {
        lastActive: 'desc',
      },
    });

    return NextResponse.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const newDevice = await prisma.device.create({
      data: {
        userId: data.userId,
        deviceId: data.deviceId,
        deviceName: data.deviceName,
        deviceType: data.deviceType || null,
        os: data.os || null,
        appVersion: data.appVersion || null,
        lastActive: new Date(),
        fcmToken: data.fcmToken || null,
      },
    });

    return NextResponse.json(newDevice);
  } catch (error) {
    console.error('Error creating device:', error);
    return NextResponse.json({ error: 'Failed to create device' }, { status: 500 });
  }
}
