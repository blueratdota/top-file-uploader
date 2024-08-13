import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

// to create folder
// put in body the {name:folderName, authorId:userId (uuid)}
router.post("/create", async (req, res, next) => {
  const { name, authorId } = req.body;
  const folder = await prisma.folders.create({
    data: { name: name, authorId: authorId }
  });
  res.status(200).json(folder);
});

export default router;
