// app/api/devices/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma  from "../../../../../prisma/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const device = await prisma.device.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    return NextResponse.json(device);
  } catch (error) {
    console.error('Error fetching device:', error);
    return NextResponse.json({ error: 'Failed to fetch device' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();

  try {
    const updatedDevice = await prisma.device.update({
      where: { id },
      data: {
        deviceId: data.deviceId,
        deviceName: data.deviceName,
        deviceType: data.deviceType,
        os: data.os,
        appVersion: data.appVersion,
        lastActive: new Date(), // Update last active on any update
        fcmToken: data.fcmToken,
      },
    });

    return NextResponse.json(updatedDevice);
  } catch (error) {
    console.error('Error updating device:', error);
    return NextResponse.json({ error: 'Failed to update device' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.device.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Error deleting device:', error);
    return NextResponse.json({ error: 'Failed to delete device' }, { status: 500 });
  }
}
