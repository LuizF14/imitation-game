/*
  Warnings:

  - Added the required column `type` to the `AIModel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AIModelType" AS ENUM ('LANGUAGE_MODEL', 'IMAGE_GENERATION_MODEL');

-- CreateEnum
CREATE TYPE "HumanOrAIEnum" AS ENUM ('HUMAN', 'AI');

-- DropForeignKey
ALTER TABLE "PlayerJudgment" DROP CONSTRAINT "PlayerJudgment_judged_ai_id_fkey";

-- DropForeignKey
ALTER TABLE "PlayerJudgment" DROP CONSTRAINT "PlayerJudgment_judged_id_fkey";

-- AlterTable
ALTER TABLE "AIModel" ADD COLUMN     "type" "AIModelType" NOT NULL;

-- AlterTable
ALTER TABLE "PlayerJudgment" ALTER COLUMN "judged_ai_id" DROP NOT NULL,
ALTER COLUMN "judged_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "imageURL" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "isAI" "HumanOrAIEnum" NOT NULL,
    "fromModelId" TEXT,
    "fromAdminId" TEXT,
    "categoryId" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenContentCategory" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "basePrompt" VARCHAR(1024) NOT NULL,

    CONSTRAINT "GenContentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageClassificationRound" (
    "id" TEXT NOT NULL,
    "userAnswer" "HumanOrAIEnum" NOT NULL,
    "timeToAnswerMs" INTEGER NOT NULL,
    "imageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ImageClassificationRound_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GenContentCategory_name_key" ON "GenContentCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ImageClassificationRound_imageId_key" ON "ImageClassificationRound"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageClassificationRound_userId_key" ON "ImageClassificationRound"("userId");

-- AddForeignKey
ALTER TABLE "PlayerJudgment" ADD CONSTRAINT "PlayerJudgment_judged_ai_id_fkey" FOREIGN KEY ("judged_ai_id") REFERENCES "AIModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerJudgment" ADD CONSTRAINT "PlayerJudgment_judged_id_fkey" FOREIGN KEY ("judged_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_fromModelId_fkey" FOREIGN KEY ("fromModelId") REFERENCES "AIModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_fromAdminId_fkey" FOREIGN KEY ("fromAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GenContentCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageClassificationRound" ADD CONSTRAINT "ImageClassificationRound_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageClassificationRound" ADD CONSTRAINT "ImageClassificationRound_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
