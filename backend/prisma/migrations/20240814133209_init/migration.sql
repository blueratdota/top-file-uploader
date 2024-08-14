/*
  Warnings:

  - You are about to drop the column `storedFilesId` on the `Folders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Folders" DROP CONSTRAINT "Folders_storedFilesId_fkey";

-- AlterTable
ALTER TABLE "Folders" DROP COLUMN "storedFilesId";
