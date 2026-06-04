/*
  Warnings:

  - Added the required column `sessionId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `judged_ai_id` to the `PlayerJudgment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `judged_id` to the `PlayerJudgment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `PlayerJudgment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentSessionId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "sessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PlayerJudgment" ADD COLUMN     "judged_ai_id" TEXT NOT NULL,
ADD COLUMN     "judged_id" TEXT NOT NULL,
ADD COLUMN     "sessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentSessionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIPlayer" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,

    CONSTRAINT "AIPlayer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentSessionId_fkey" FOREIGN KEY ("currentSessionId") REFERENCES "ChatSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerJudgment" ADD CONSTRAINT "PlayerJudgment_judged_ai_id_fkey" FOREIGN KEY ("judged_ai_id") REFERENCES "AIModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerJudgment" ADD CONSTRAINT "PlayerJudgment_judged_id_fkey" FOREIGN KEY ("judged_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerJudgment" ADD CONSTRAINT "PlayerJudgment_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIPlayer" ADD CONSTRAINT "AIPlayer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIPlayer" ADD CONSTRAINT "AIPlayer_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "AIModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
