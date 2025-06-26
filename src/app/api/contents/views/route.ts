import { NextResponse } from 'next/server'
import prisma  from "../../../../../prisma/prisma"

// export async function POST(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { userId, deviceInfo } = await request.json()

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

//     // Incrémenter le compteur de vues
//     await prisma.content.update({
//       where: { id: params.id },
//       data: {
//         views: {
//           increment: 1
//         }
//       }
//     })

//     // Enregistrer l'historique si l'utilisateur est connecté
//     if (userId) {
//       await prisma.history.upsert({
//         where: {
//           userId_contentId: {
//             userId,
//             contentId: params.id
//           }
//         },
//         update: {
//           progress: 0, // Réinitialiser la progression si c'est une nouvelle vue
//           lastWatchedAt: new Date(),
//           deviceInfo
//         },
//         create: {
//           userId,
//           contentId: params.id,
//           progress: 0,
//           deviceInfo
//         }
//       })
//     }

//     return NextResponse.json(
//       { message: 'View counted successfully' },
//       { status: 200 }
//     )
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to count view' },
//       { status: 500 }
//     )
//   }
// }