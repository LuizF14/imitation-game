/*
  Warnings:

  - You are about to drop the column `aiplayer_id` on the `ChatSession` table. All the data in the column will be lost.
  - You are about to drop the column `userplayer1_id` on the `ChatSession` table. All the data in the column will be lost.
  - You are about to drop the column `userplayer2_id` on the `ChatSession` table. All the data in the column will be lost.
  - You are about to drop the column `aiPlayerId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `judged_ai_id` on the `PlayerJudgment` table. All the data in the column will be lost.
  - You are about to drop the column `judged_user_id` on the `PlayerJudgment` table. All the data in the column will be lost.
  - You are about to drop the `AIPlayer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `playerId` to the `AIModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player1Id` to the `ChatSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2Id` to the `ChatSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `judgedId` to the `PlayerJudgment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AIPlayer" DROP CONSTRAINT "AIPlayer_modelId_fkey";

-- DropForeignKey
ALTER TABLE "ChatSession" DROP CONSTRAINT "ChatSession_aiplayer_id_fkey";

-- DropForeignKey
ALTER TABLE "ChatSession" DROP CONSTRAINT "ChatSession_userplayer1_id_fkey";

-- DropForeignKey
ALTER TABLE "ChatSession" DROP CONSTRAINT "ChatSession_userplayer2_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_aiPlayerId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerJudgment" DROP CONSTRAINT "PlayerJudgment_judged_ai_id_fkey";

-- DropForeignKey
ALTER TABLE "PlayerJudgment" DROP CONSTRAINT "PlayerJudgment_judged_user_id_fkey";

-- DropIndex
DROP INDEX "ChatSession_aiplayer_id_key";

-- AlterTable
ALTER TABLE "AIModel" ADD COLUMN     "playerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ChatSession" DROP COLUMN "aiplayer_id",
DROP COLUMN "userplayer1_id",
DROP COLUMN "userplayer2_id",
ADD COLUMN     "player1Id" TEXT NOT NULL,
ADD COLUMN     "player2Id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "aiPlayerId",
DROP COLUMN "userId",
ADD COLUMN     "playerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PlayerJudgment" DROP COLUMN "judged_ai_id",
DROP COLUMN "judged_user_id",
ADD COLUMN     "judgedId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "playerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "AIPlayer";

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "type" "HumanOrAIEnum" NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerJudgment" ADD CONSTRAINT "PlayerJudgment_judgedId_fkey" FOREIGN KEY ("judgedId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIModel" ADD CONSTRAINT "AIModel_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
