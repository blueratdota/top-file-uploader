import express from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

router.get("/:id", async (req, res, next) => {
  const userId = req.params.id;
  const userData = await prisma.user.findMany({
    where: { id: userId },
    include: { Folders: true }
  });
  res.status(200).json(userData);
});

router.post("/signup", async (req, res, next) => {
  const { name, password } = req.body;
  const user = await prisma.user.create({
    data: { name: name, password: password }
  });
  res.status(200).json(user);
});

export default router;
