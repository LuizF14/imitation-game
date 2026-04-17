/*
  Warnings:

  - Added the required column `pathURL` to the `AIModel` table without a default value. This is not possible if the table is not empty.
  - Made the column `categoryId` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AIProvider" DROP CONSTRAINT "AIProvider_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_categoryId_fkey";

-- AlterTable
ALTER TABLE "AIModel" ADD COLUMN     "pathURL" VARCHAR(64) NOT NULL;

-- AlterTable
ALTER TABLE "AIProvider" ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "admin_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "AIProvider" ADD CONSTRAINT "AIProvider_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GenContentCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
