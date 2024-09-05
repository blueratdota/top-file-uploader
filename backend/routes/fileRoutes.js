import multer from "multer";
import express from "express";
const router = express.Router();
const upload = multer({ dest: "uploads" });
import { protect } from "../middleware/authMiddleware.js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// FILE UPLOAD #######################################
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
// FILE COPY #######################################
// check if destination folder has a file that contains a file with the same name
// rename the copied file to fileName (1) >> continue copy
router.post("/copy", protect, async (req, res, next) => {
  const fileData = {
    path: req.body.path,
    name: req.body.name,
    fileSize: parseInt(req.body.fileSize),
    authorId: req.user.id,
    foldersId: req.body.newFolder,
    destinationFolderId: req.body.destinationFolderId
  };
  try {
    const lookUpDuplicate = await prisma.files.findFirst({
      where: {
        name: fileData.name,
        authorId: fileData.authorId,
        foldersId: fileData.destinationFolderId
          ? fileData.destinationFolderId
          : null,
        inTrash: false
      }
    });
    let generatedName = "";
    if (lookUpDuplicate) {
      const getName = async (name) => {
        return await prisma.files.findFirst({
          where: {
            path: fileData.path,
            name: name,
            authorId: fileData.authorId,
            foldersId: fileData.destinationFolderId
              ? fileData.destinationFolderId
              : null,
            inTrash: false
          }
        });
      };

      let n = 1;
      let newName = `Copy(${n}) ${fileData.name}`;
      while (await getName(newName)) {
        n++;
        newName = `Copy(${n}) ${fileData.name}`;
      }
      generatedName = newName;
    }
    console.log(fileData);
    const newFile = await prisma.files.create({
      data: {
        path: fileData.path,
        name: (() => {
          if (lookUpDuplicate) {
            return generatedName;
          } else {
            return fileData.name;
          }
        })(),
        fileSize: fileData.fileSize,
        authorId: req.user.id,
        foldersId: fileData.destinationFolderId || null
      }
    });
    console.log(newFile);
    const result = { isSuccess: true, msg: "File copy successful" };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    const result = { isSuccess: false, msg: "File copy unccessful" };
    res.status(200).json(result);
  }
});
router.put("/to-trash", async (req, res, next) => {
  const { id, inTrash } = req.body;
  const file = await prisma.files.update({
    where: { id: id },
    data: {
      inTrash: true,
      isDeleted: true
    }
  });
  res.status(200).json(file);
});
// FILE RESTORE #######################################
// if destination has no same file name, simple inTrash=false update ***DONE
// if destination doesnt exist, set destination to null, inTrash=false ***DONE
// if destination exist, inTrash=false
// if destination has same file name, update name to fileName (n)
router.put("/restore", protect, async (req, res, next) => {
  const { id, name, foldersId, inTrash } = req.body;
  let destinationExists = foldersId;
  if (destinationExists != null) {
    destinationExists = await prisma.folders.findUnique({
      where: { id: foldersId, inTrash: false }
    });
  }
  const destinationDupe = await prisma.files.findFirst({
    where: {
      name: name,
      foldersId: destinationExists ? foldersId : null,
      inTrash: false
    }
  });

  if (destinationDupe) {
    const lookUpDuplicate = await prisma.files.findFirst({
      where: {
        name: name,
        authorId: req.user.id,
        foldersId: destinationExists ? foldersId : null
      }
    });
    let generatedName = "";
    if (lookUpDuplicate) {
      const getName = async (name) => {
        return await prisma.files.findFirst({
          where: {
            name: name,
            authorId: req.user.id,
            foldersId: destinationExists ? foldersId : null
          }
        });
      };
      let n = 1;
      let newName = `Copy(${n}) ${name}`;
      while (await getName(newName)) {
        n++;
        newName = `Copy(${n}) ${name}`;
      }
      generatedName = newName;
    }
    await prisma.files.update({
      where: { id: id },
      data: {
        isDeleted: false,
        inTrash: false,
        foldersId: destinationExists ? foldersId : null,
        name: generatedName
      }
    });
    console.log("****THIS PART RUNS****");
  } else {
    console.log("NO DUPLICATE KIND OF file RESTORE");
    await prisma.files.update({
      where: { id: id },
      data: {
        isDeleted: false,
        inTrash: false,
        foldersId: destinationExists ? foldersId : null
      }
    });
  }
  const result = { isSuccess: true, msg: "File restore successful" };
  res.status(200).json(result);
});
// FILE RENAME #######################################
// check if file name exists on the folder, proceed rename if false
// filetype (.exe,.json,.txt) maintain >> to do
router.put("/rename", protect, async (req, res, next) => {
  const { id, name, newName, foldersId } = req.body;
  const checkDuplicate = await prisma.files.findFirst({
    where: {
      authorId: req.user.id,
      foldersId: foldersId,
      name: newName,
      inTrash: false
    }
  });
  if (!checkDuplicate) {
    const folder = await prisma.files.update({
      where: { id: id },
      data: {
        name: newName
      }
    });
    const result = { isSuccess: true, msg: "File rename successful" };
    res.status(200).json(result);
  } else {
    const result = { isSuccess: false, msg: "File rename unsuccessful" };
    res.status(409).json(result);
  }
});
// get all files owned by logged in user
router.get("/get-all/:sortType/:sortOrder", protect, async (req, res, next) => {
  const sortOrder = req.params.sortOrder;
  const sortType = (() => {
    if (req.params.sortType == null) {
      return "name";
    } else return req.params.sortType;
  })();

  let sortSettings = {};
  if (!sortType || sortType == "null") {
    sortSettings["name"] = sortOrder;
  } else {
    sortSettings[sortType] = sortOrder;
  }
  // console.log("#####fileroutes", sortSettings);
  const files = await prisma.files.findMany({
    where: { authorId: req.user.id },
    include: {
      author: { select: { name: true } },
      allowedUsers: { select: { name: true } }
    },
    orderBy: sortSettings
  });

  res.status(200).json(files);
});
// download file
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

router.delete("/delete/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    await prisma.files.delete({ where: { id: id } });
    const result = { isSuccess: true, msg: "File delete successful" };
    res.status(200).json(result);
  } catch (error) {
    const result = { isSuccess: false, msg: "File delete unsuccessful" };
    res.status(200).json(result);
  }
});

export default router;
