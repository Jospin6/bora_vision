import { NextResponse, NextRequest } from 'next/server'
import prisma  from "../../../../../../prisma/prisma"

// // PATCH - Définir un média comme média par défaut
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // Vérifier si le média existe
//     const media = await prisma.media.findUnique({
//       where: { id: params.id },
//       include: {
//         content: {
//           select: {
//             id: true
//           }
//         }
//       }
//     })

//     if (!media) {
//       return NextResponse.json(
//         { error: 'Media not found' },
//         { status: 404 }
//       )
//     }

//     // D'abord, réinitialiser tous les médias par défaut pour ce contenu
//     await prisma.media.updateMany({
//       where: {
//         contentId: media.contentId,
//         isDefault: true
//       },
//       data: {
//         isDefault: false
//       }
//     })

//     // Ensuite, définir ce média comme par défaut
//     const updatedMedia = await prisma.media.update({
//       where: { id: params.id },
//       data: {
//         isDefault: true
//       },
//       include: {
//         content: {
//           select: {
//             id: true,
//             title: true
//           }
//         }
//       }
//     })

//     return NextResponse.json(updatedMedia)
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to set default media' },
//       { status: 500 }
//     )
//   }
// }