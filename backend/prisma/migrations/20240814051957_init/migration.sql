/*
  Warnings:

  - Added the required column `path` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "downloadCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "updatedName" TEXT;
