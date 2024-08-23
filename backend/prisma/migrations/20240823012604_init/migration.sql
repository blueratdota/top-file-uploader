-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Folders" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
