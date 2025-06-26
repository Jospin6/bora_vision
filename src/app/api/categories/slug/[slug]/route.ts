import { NextResponse } from 'next/server'
import prisma  from "../../../../../../prisma/prisma"

// GET - Récupérer une catégorie par son slug
// export async function GET(
//   request: Request,
//   { params }: { params: { slug: string } }
// ) {
//   try {
//     const category = await prisma.category.findUnique({
//       where: { slug: params.slug },
//       include: {
//         contents: {
//           where: {
//             status: 'PUBLISHED'
//           },
//           orderBy: {
//             createdAt: 'desc'
//           },
//           take: 20,
//           select: {
//             id: true,
//             title: true,
//             thumbnail: true,
//             type: true,
//             views: true,
//             createdAt: true,
//             duration: true
//           }
//         },
//         _count: {
//           select: {
//             contents: {
//               where: {
//                 status: 'PUBLISHED'
//               }
//             }
//           }
//         }
//       }
//     })

//     if (!category) {
//       return NextResponse.json(
//         { error: 'Category not found' },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json(category)
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch category by slug' },
//       { status: 500 }
//     )
//   }
// }