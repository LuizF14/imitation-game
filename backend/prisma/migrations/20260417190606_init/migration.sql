/*
  Warnings:

  - Added the required column `updatedAt` to the `AIPlayer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ChatSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `GenContentCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ImageClassificationRound` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AIPlayer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ChatSession" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "GenContentCategory" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ImageClassificationRound" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
