/*
  Warnings:

  - Added the required column `storedFilesId` to the `Folders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Folders" ADD COLUMN     "storedFilesId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_storedFilesId_fkey" FOREIGN KEY ("storedFilesId") REFERENCES "Files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
