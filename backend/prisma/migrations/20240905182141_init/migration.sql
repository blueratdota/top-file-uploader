-- DropIndex
DROP INDEX "Files_name_foldersId_key";

-- CreateTable
CREATE TABLE "_fileViewers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_fileViewers_AB_unique" ON "_fileViewers"("A", "B");

-- CreateIndex
CREATE INDEX "_fileViewers_B_index" ON "_fileViewers"("B");

-- AddForeignKey
ALTER TABLE "_fileViewers" ADD CONSTRAINT "_fileViewers_A_fkey" FOREIGN KEY ("A") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fileViewers" ADD CONSTRAINT "_fileViewers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
