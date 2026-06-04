/*
  Warnings:

  - You are about to drop the column `playerId` on the `AIModel` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `User` table. All the data in the column will be lost.
  - Added the required column `aiId` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AIModel" DROP CONSTRAINT "AIModel_playerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_playerId_fkey";

-- AlterTable
ALTER TABLE "AIModel" DROP COLUMN "playerId";

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "aiId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "playerId";

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_aiId_fkey" FOREIGN KEY ("aiId") REFERENCES "AIModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
