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

router.get("/get/:id", async (req, res, next) => {
  const id = req.params.id;
  const folder = await prisma.folders.findUnique({
    where: { id: id },
    include: {
      childFolder: true,
      allowedUsers: true
    }
  });
  res.status(200).json(folder);
});

export default router;
