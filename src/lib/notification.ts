import prisma from '../../prisma/prisma'
// Fonction utilitaire réutilisable
export async function createNotification({
  userId,
  type,
  postId,
  senderId
}: {
  userId: string
  type: string
  postId?: string
  senderId?: string
}) {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      postId,
      senderId
    },
    include: {
      post: {
        include: {
          author: true
        }
      },
      sender: true
    }
  })
}