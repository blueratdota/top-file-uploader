import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
const prisma = new PrismaClient();

// to create folder
// put in body the {name:folderName, author:name(optional), parentFolderId:id(if a subfolder)}
router.post("/create", protect, async (req, res, next) => {
  const folderData = {
    name: req.body.name,
    authorId: req.user.id,
    parentFolderId: (() =>
      req.body.parentFolderId ? req.body.parentFolderId : null)()
  };
  const lookUpDuplicate = await prisma.folders.findFirst({
    where: {
      name: folderData.name,
      authorId: folderData.authorId,
      parentFolderId: folderData.parentFolderId || null
    }
  });
  if (lookUpDuplicate) {
    const error = new Error("This folder already exist in this directory");
    error.status = 400;
    return next(error);
  }
  const folder = await prisma.folders.create({
    data: { ...folderData }
  });
  res.status(200).json(folder);
});

// to get folder as owner
// needs folderId as url parameter, as well as parent folder
router.get("/get/:id", async (req, res, next) => {
  const id = req.params.id;
  const folder = await prisma.folders.findMany({
    where: { parentFolderId: id },
    include: {
      childFolder: true,
      allowedUsers: true,
      storedFiles: true
    }
  });
  // console.log(folder.childFolder.length);

  res.status(200).json(folder);
});

//create a get all folders based on logged in user
router.get("/get-all/:sortType/:sortOrder", protect, async (req, res, next) => {
  const sortOrder = (() => {
    if (
      req.params.sortType == "downloadCount" ||
      req.params.sortType == "fileSize"
    ) {
      return "asc";
    } else return req.params.sortOrder;
  })();
  const sortType = (() => {
    if (
      req.params.sortType == null ||
      req.params.sortType == "downloadCount" ||
      req.params.sortType == "fileSize"
    ) {
      return "name";
    } else return req.params.sortType;
  })();

  let sortSettings = {};
  if (!sortType || sortType == "null") {
    sortSettings["name"] = sortOrder;
  } else {
    sortSettings[sortType] = sortOrder;
  }

  // console.log("#####folderroutes", sortSettings);
  const folders = await prisma.folders.findMany({
    where: { authorId: req.user.id },
    orderBy: sortSettings,
    include: {
      childFolder: true,
      allowedUsers: true,
      storedFiles: true,
      author: true
    }
  });
  // console.log(folders);
  res.status(200).json(folders);
});

//create a get all folders based on logged in user
router.get(
  "/get-all-shared/:sortType/:sortOrder",
  protect,
  async (req, res, next) => {
    const sortOrder = (() => {
      if (
        req.params.sortType == "downloadCount" ||
        req.params.sortType == "fileSize"
      ) {
        return "asc";
      } else return req.params.sortOrder;
    })();
    const sortType = (() => {
      if (
        req.params.sortType == null ||
        req.params.sortType == "downloadCount" ||
        req.params.sortType == "fileSize"
      ) {
        return "name";
      } else return req.params.sortType;
    })();

    let sortSettings = {};
    if (!sortType || sortType == "null") {
      sortSettings["name"] = sortOrder;
    } else {
      sortSettings[sortType] = sortOrder;
    }

    let viewableFolders = [];

    const sharedToUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        sharedFolders: { include: { childFolder: true, storedFiles: true } }
      }
    });

    const recursiveFunc = async (array) => {
      const results = [];

      for (const folder of array) {
        if (folder.childFolder.length < 1) {
          results.push(await folder);
        } else {
          results.push(await folder);
          for (const subfolder of folder.childFolder) {
            const childFolder = await prisma.folders.findFirst({
              where: { id: subfolder.id },
              include: {
                childFolder: true,
                storedFiles: true
              }
            });
            results.push(...(await recursiveFunc([childFolder])));
          }
        }
      }
      return results;
    };

    res.status(200).json(await recursiveFunc(sharedToUser.sharedFolders));
  }
);

// to update folder as owner
router.put("/rename", protect, async (req, res, next) => {
  const { id, newName } = req.body;
  const folder = await prisma.folders.update({
    where: { id: id },
    data: {
      name: newName
    }
  });
  res.status(200).json(folder);
});
// to update folder inTrash = true/false
router.put("/to-trash/:id/:inTrash", protect, async (req, res, next) => {
  const { id, inTrash } = req.params;
  const folder = await prisma.folders.update({
    where: { id: id },
    data: {
      inTrash: inTrash == "true"
    }
  });
  res.status(200).json(folder);
});
// to update folder isDeleted = true/false
router.put("/to-deleted/:id/:isDeleted", protect, async (req, res, next) => {
  const { id, isDeleted } = req.params;
  const folder = await prisma.folders.update({
    where: { id: id },
    data: {
      isDeleted: isDeleted == "true"
    }
  });
  res.status(200).json(folder);
});

// delete folder
// needs folderId as url parameter
router.delete("/delete", protect, async (req, res, next) => {
  const { id } = req.body;
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

// deletion implementation
// WHEN DELETING A FOLDER > update to isTrash=true
// but subfolders will not have isTrash=true > they cant be accessed since their folder will not be displayed if they have isTrash=true
// @<Trash/> all with isTrash=true will be displayed
// @<Trash/> change the displayed components to be unable to be clicked and limit menu options
//

export default router;
