/*
  Warnings:

  - You are about to drop the column `apiKey` on the `AIProvider` table. All the data in the column will be lost.
  - Added the required column `apiKey` to the `AIModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AIModel" ADD COLUMN     "apiKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AIProvider" DROP COLUMN "apiKey";
