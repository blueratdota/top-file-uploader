/*
  Warnings:

  - You are about to drop the column `parentFolder` on the `Folders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Folders" DROP COLUMN "parentFolder",
ADD COLUMN     "parentFolderId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "foldersId" TEXT;

-- CreateTable
CREATE TABLE "_folderViewers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_folderViewers_AB_unique" ON "_folderViewers"("A", "B");

-- CreateIndex
CREATE INDEX "_folderViewers_B_index" ON "_folderViewers"("B");

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "Folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_folderViewers" ADD CONSTRAINT "_folderViewers_A_fkey" FOREIGN KEY ("A") REFERENCES "Folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_folderViewers" ADD CONSTRAINT "_folderViewers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
