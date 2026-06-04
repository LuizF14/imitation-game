/*
  Warnings:

  - You are about to drop the column `sessionId` on the `AIPlayer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[aiplayer_id]` on the table `ChatSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userplayer1_id` to the `ChatSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userplayer2_id` to the `ChatSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AIPlayer" DROP CONSTRAINT "AIPlayer_sessionId_fkey";

-- AlterTable
ALTER TABLE "AIPlayer" DROP COLUMN "sessionId";

-- AlterTable
ALTER TABLE "ChatSession" ADD COLUMN     "aiplayer_id" TEXT,
ADD COLUMN     "userplayer1_id" TEXT NOT NULL,
ADD COLUMN     "userplayer2_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChatSession_aiplayer_id_key" ON "ChatSession"("aiplayer_id");

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_userplayer1_id_fkey" FOREIGN KEY ("userplayer1_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_userplayer2_id_fkey" FOREIGN KEY ("userplayer2_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_aiplayer_id_fkey" FOREIGN KEY ("aiplayer_id") REFERENCES "AIPlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
