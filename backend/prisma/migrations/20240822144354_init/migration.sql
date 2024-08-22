-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "inTrash" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Folders" ADD COLUMN     "inTrash" BOOLEAN NOT NULL DEFAULT false;
