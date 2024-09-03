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

router.post("/copy", protect, async (req, res, next) => {
  const copyFolder = {
    id: req.body.id,
    destinationFolderId: (() =>
      req.body.destinationFolderId ? req.body.destinationFolderId : null)(),
    parentFolderId: req.body.parentFolderId,
    name: req.body.name
  };
  const recursiveFunc = async (folderObj) => {
    const folder = await prisma.folders.findFirst({
      where: { id: folderObj.id },
      include: { childFolder: true, storedFiles: true }
    });
    const lookUpDuplicate = await prisma.folders.findFirst({
      where: {
        name: folderObj.name,
        authorId: req.user.id,
        parentFolderId: folderObj.destinationFolderId
      }
    });
    let generatedName = "";
    if (lookUpDuplicate) {
      const getName = async (name) => {
        return await prisma.folders.findFirst({
          where: {
            name: name,
            authorId: req.user.id,
            parentFolderId: folderObj.destinationFolderId
          }
        });
      };
      let n = 1;
      let newName = `${folderObj.name} (${n})`;
      while (await getName(newName)) {
        n++;
        newName = `${folderObj.name} (${n})`;
      }
      generatedName = newName;
    }

    console.log(folderObj.destinationFolderId);
    const newFolder = await prisma.folders.create({
      data: {
        name: (() => {
          if (lookUpDuplicate) {
            return generatedName;
          } else {
            return folderObj.name;
          }
        })(),
        authorId: req.user.id,
        parentFolderId: folderObj.destinationFolderId
      }
    });
    if (folder.childFolder.length > 0) {
      for (const f of folder.childFolder) {
        await recursiveFunc({ ...f, destinationFolderId: newFolder.id });
      }
    }
    if (folder.storedFiles.length > 0) {
      for (const f of folder.storedFiles) {
        const fileData = {
          path: f.path,
          name: f.name,
          fileSize: f.fileSize,
          authorId: req.user.id,
          foldersId: newFolder.id
        };
        const file = await prisma.files.create({ data: { ...fileData } });
      }
    }
  };
  await recursiveFunc(copyFolder);
  res.status(200).json(copyFolder);
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
      allowedUsers: { select: { name: true } },
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
        sharedFolders: {
          include: {
            childFolder: true,
            storedFiles: true,
            author: { select: { name: true } },
            allowedUsers: { select: { name: true } }
          }
        }
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
                storedFiles: true,
                author: { select: { name: true } },
                allowedUsers: { select: { name: true } }
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
// ### ALL UPDATE/PUT ROUTES FOR FOLDERS
// to update folder name as owner
router.put("/rename", protect, async (req, res, next) => {
  const { id, oldName, newName, parentFolderId } = req.body;
  const checkDuplicate = await prisma.folders.findFirst({
    where: {
      authorId: req.user.id,
      parentFolderId: parentFolderId,
      name: newName
    }
  });
  if (!checkDuplicate) {
    const folder = await prisma.folders.update({
      where: { id: id },
      data: {
        name: newName
      }
    });
    const result = { isSuccess: true, msg: "Folder rename successful" };
    res.status(200).json(result);
  } else {
    const result = { isSuccess: false, msg: "Folder rename unsuccessful" };
    res.status(409).json(result);
  }
});
// to update folder parentId (moving folder location)
router.put("/move", protect, async (req, res, next) => {
  const data = {
    name: req.body.name,
    newParentFolderId: req.body.newParentFolderId,
    id: req.body.id
  };

  const ownedFolders = await prisma.folders.findFirst({
    where: {
      authorId: req.user.id,
      parentFolderId: data.newParentFolderId,
      name: data.name
    }
  });

  if (!ownedFolders) {
    await prisma.folders.update({
      where: { id: data.id },
      data: { parentFolderId: data.newParentFolderId }
    });
    const result = { isSuccess: true, msg: "Folder move successful" };
    res.status(200).json(result);
  } else {
    const result = { isSuccess: false, msg: "Folder move unsuccessful" };
    res.status(409).json(result);
  }
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
// ### END OF UPDATE/PUT ROUTES FOR FOLDERS

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
