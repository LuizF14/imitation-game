-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_currentSessionId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "currentSessionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentSessionId_fkey" FOREIGN KEY ("currentSessionId") REFERENCES "ChatSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
