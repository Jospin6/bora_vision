import { NextResponse, NextRequest } from 'next/server'
import prisma  from "../../../../../../prisma/prisma"

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { token } = await request.json()

//     if (!token) {
//       return NextResponse.json(
//         { error: 'Verification token is required' },
//         { status: 400 }
//       )
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: params.id }
//     })

//     if (!user) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       )
//     }

//     // if (user.isVerified) {
//     //   return NextResponse.json(
//     //     { error: 'User is already verified' },
//     //     { status: 400 }
//     //   )
//     // }

//     // if (user.verificationToken !== token) {
//     //   return NextResponse.json(
//     //     { error: 'Invalid verification token' },
//     //     { status: 403 }
//     //   )
//     // }

//     // Mettre à jour l'utilisateur comme vérifié
//     // await prisma.user.update({
//     //   where: { id: params.id },
//     //   data: {
//     //     isVerified: true,
//     //     verificationToken: null
//     //   }
//     // })

//     return NextResponse.json(
//       { message: 'User verified successfully' },
//       { status: 200 }
//     )
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to verify user' },
//       { status: 500 }
//     )
//   }
// }