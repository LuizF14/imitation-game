/*
  Warnings:

  - You are about to drop the column `judged_id` on the `PlayerJudgment` table. All the data in the column will be lost.
  - You are about to drop the column `currentSessionId` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `AIModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AIProvider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlayerJudgment" DROP CONSTRAINT "PlayerJudgment_judged_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_currentSessionId_fkey";

-- DropIndex
DROP INDEX "ImageClassificationRound_userId_key";

-- AlterTable
ALTER TABLE "AIModel" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "AIProvider" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "content" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PlayerJudgment" DROP COLUMN "judged_id",
ADD COLUMN     "judged_user_id" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "currentSessionId",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "PlayerJudgment" ADD CONSTRAINT "PlayerJudgment_judged_user_id_fkey" FOREIGN KEY ("judged_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
