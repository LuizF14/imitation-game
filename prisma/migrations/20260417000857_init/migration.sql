-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "aiPlayerId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_aiPlayerId_fkey" FOREIGN KEY ("aiPlayerId") REFERENCES "AIPlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
