/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `AIProvider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `AIProvider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `AIProvider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AIProvider" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AIProvider_email_key" ON "AIProvider"("email");
