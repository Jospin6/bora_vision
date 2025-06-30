/*
  Warnings:

  - You are about to drop the column `soundId` on the `Post` table. All the data in the column will be lost.
  - Added the required column `postId` to the `Sound` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_soundId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "soundId";

-- AlterTable
ALTER TABLE "Sound" ADD COLUMN     "postId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Sound" ADD CONSTRAINT "Sound_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
