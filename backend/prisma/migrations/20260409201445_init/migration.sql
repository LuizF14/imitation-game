/*
  Warnings:

  - You are about to drop the column `score` on the `Admin` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProviderStatusEnum" AS ENUM ('APPROVED', 'REVOKED', 'PENDING');

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "score";

-- CreateTable
CREATE TABLE "AIProvider" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "apiKey" TEXT NOT NULL,
    "baseURL" TEXT NOT NULL,
    "status" "ProviderStatusEnum" NOT NULL,
    "admin_id" TEXT NOT NULL,

    CONSTRAINT "AIProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIModel" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "providerId" TEXT NOT NULL,

    CONSTRAINT "AIModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIProvider_name_key" ON "AIProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AIModel_name_key" ON "AIModel"("name");

-- AddForeignKey
ALTER TABLE "AIProvider" ADD CONSTRAINT "AIProvider_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIModel" ADD CONSTRAINT "AIModel_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "AIProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
