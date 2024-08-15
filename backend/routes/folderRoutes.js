import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
const prisma = new PrismaClient();

// to create folder
// put in body the {name:folderName, authorId:userId (uuid)}
router.post("/create", protect, async (req, res, next) => {
  const folderData = {
    name: req.body.name,
    authorId: req.user.id,
    parentFolderId: (() =>
      req.body.parentFolderId ? req.body.parentFolderId : null)()
  };

  const folder = await prisma.folders.create({
    data: { ...folderData }
  });
  res.status(200).json(folder);
});

// to get folder
// needs folderId as url parameter
router.get("/get/:id", async (req, res, next) => {
  const id = req.params.id;
  const folder = await prisma.folders.findUnique({
    where: { id: id },
    include: {
      childFolder: true,
      allowedUsers: true,
      storedFiles: true
    }
  });
  console.log(folder.childFolder.length);

  res.status(200).json(folder);
});

// delete folder
router.delete("/delete/:id", protect, async (req, res, next) => {
  const id = req.params.id;
  let foldersDeleted = [];
  const deleteFolder = async (folderId) => {
    foldersDeleted.push(folderId);
    const folderData = await prisma.folders.findUnique({
      where: { id: folderId },
      include: {
        childFolder: true,
        allowedUsers: true,
        storedFiles: true
      }
    });
    if (folderData.childFolder.length == 0) {
      console.log(`deleted ${folderData.name}`);
      const folder = await prisma.folders.delete({
        where: { id: folderId }
      });
      return;
    }
    // deleteFolder(folderData.childFolder.id);
    folderData.childFolder.forEach(async (folder) => {
      await deleteFolder(folder.id);
    });
    console.log(`deleted ${folderData.name}`);
    const folder = await prisma.folders.delete({
      where: { id: folderId }
    });
  };
  await deleteFolder(id);
  res.status(200).json({ msg: `deleted folder ${id}` });
});

export default router;
