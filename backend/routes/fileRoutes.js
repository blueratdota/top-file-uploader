import multer from "multer";
import express from "express";
const router = express.Router();
const upload = multer({ dest: "uploads" });
import { protect } from "../middleware/authMiddleware.js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

router.post(
  "/upload",
  protect,
  upload.single("file"),
  async (req, res, next) => {
    // console.log(req);
    // {
    //   fieldname: 'file',
    //   originalname: 'Plain Text.txt',
    //   encoding: '7bit',
    //   mimetype: 'text/plain',
    //   destination: 'uploads',
    //   filename: '447c4fc5ac11f262508fe41cc8a62a75',
    //   path: 'uploads/447c4fc5ac11f262508fe41cc8a62a75',
    //   size: 321
    // }
    try {
      const fileData = {
        path: req.file.path,
        name: req.file.originalname,
        fileSize: req.file.size,
        authorId: req.user.id,
        foldersId: (() => {
          if (req.body.foldersId == null || req.body.foldersId == undefined)
            return null;
          else {
            return req.body.foldersId;
          }
        })()
      };

      const file = await prisma.files.create({ data: { ...fileData } });
      console.log(file);
      //   {
      //     "id": "da412ec4-5b5a-4aab-a91f-82aabdc73a35",
      //     "name": "Plain Text.txt",
      //     "updatedName": null,
      //     "authorId": "1b525bd4-da0f-43f1-828f-1deaae8c5b12",
      //     "createdAt": "2024-08-14T05:32:25.875Z",
      //     "updatedAt": "2024-08-14T05:32:25.875Z",
      //     "downloadCount": 0,
      //     "path": "uploads/439ac24825a433e4b2780486cfd1ebaa"
      // }

      res.status(200).json(file);
    } catch (error) {
      next(error);
    }
  }
);

// get all files owned by logged in user
router.get("/get-all/:sortType/:sortOrder", protect, async (req, res, next) => {
  const sortOrder = req.params.sortOrder;
  const sortType = (() => {
    if (req.params.sortType == null) {
      return "name";
    } else return req.params.sortType;
  })();

  let sortSettings = {};
  sortSettings[sortType] = sortOrder;

  const files = await prisma.files.findMany({
    where: { authorId: req.user.id },
    orderBy: sortSettings
  });

  res.status(200).json(files);
});

router.get("/download/:id", async (req, res, next) => {
  const id = req.params.id;
  // console.log(id);
  const file = await prisma.files.findUnique({ where: { id: id } });
  const incDownload = await prisma.files.update({
    where: { id: id },
    data: { downloadCount: { increment: 1 } }
  });
  console.log(id, file.path, file.name);
  // res.status(200).json(file);
  res.download(file.path, file.name);
});

export default router;
