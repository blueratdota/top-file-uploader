/*
  Warnings:

  - A unique constraint covering the columns `[name,foldersId]` on the table `Files` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,parentFolderId,authorId]` on the table `Folders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Files_name_foldersId_key" ON "Files"("name", "foldersId");

-- CreateIndex
CREATE UNIQUE INDEX "Folders_name_parentFolderId_authorId_key" ON "Folders"("name", "parentFolderId", "authorId");
