import { NextResponse } from 'next/server'
import prisma  from "../../../../../prisma/prisma"

// export async function PATCH(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { featured } = await request.json()

//     if (typeof featured !== 'boolean') {
//       return NextResponse.json(
//         { error: 'featured must be a boolean' },
//         { status: 400 }
//       )
//     }

//     // Vérifier si le contenu existe
//     const content = await prisma.content.findUnique({
//       where: { id: params.id }
//     })

//     if (!content) {
//       return NextResponse.json(
//         { error: 'Content not found' },
//         { status: 404 }
//       )
//     }

//     const updatedContent = await prisma.content.update({
//       where: { id: params.id },
//       data: {
//         isFeatured: featured
//       },
//       include: {
//         creator: {
//           select: {
//             id: true,
//             username: true
//           }
//         }
//       }
//     })

//     return NextResponse.json(updatedContent)
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to update featured status' },
//       { status: 500 }
//     )
//   }
// }