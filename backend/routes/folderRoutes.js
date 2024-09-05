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
      parentFolderId: folderData.parentFolderId || null,
      inTrash: false
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

router.post("/restore", protect, async (req, res, next) => {
  const { id, name, destinationFolderId, parentFolderId } = req.body;
  let parentDestinationExists = destinationFolderId;
  if (destinationFolderId != null) {
    parentDestinationExists = await prisma.folders.findUnique({
      where: { id: destinationFolderId, inTrash: false }
    });
  }
  const destinationDupe = await prisma.folders.findFirst({
    where: {
      name: name,
      parentFolderId: parentDestinationExists ? destinationFolderId : null,
      inTrash: false
    }
  });
  // check if parent folder exists
  // if doesnt exist, set to null

  if (destinationDupe) {
    const lookUpDuplicate = await prisma.folders.findFirst({
      where: {
        name: name,
        authorId: req.user.id,
        parentFolderId: parentDestinationExists ? destinationFolderId : null
      }
    });
    let generatedName = "";
    if (lookUpDuplicate) {
      const getName = async (name) => {
        return await prisma.folders.findFirst({
          where: {
            name: name,
            authorId: req.user.id,
            parentFolderId: parentDestinationExists ? destinationFolderId : null
          }
        });
      };
      let n = 1;
      let newName = `${name} (${n})`;
      while (await getName(newName)) {
        n++;
        newName = `${name} (${n})`;
      }
      generatedName = newName;
    }
    await prisma.folders.update({
      where: { id: id },
      data: {
        isDeleted: false,
        parentFolderId: parentDestinationExists ? destinationFolderId : null,
        name: generatedName
      }
    });
    console.log("****THIS PART RUNS****");
  } else {
    const { id } = req.body;
    console.log("NO DUPLICATE KIND OF RESTORE");

    await prisma.folders.update({
      where: { id: id },
      data: {
        isDeleted: false,
        parentFolderId: parentDestinationExists ? destinationFolderId : null
      }
    });
  }
  const updateToTrash = async (paramId) => {
    const folder = await prisma.folders.findFirst({
      where: { id: paramId },
      include: {
        childFolder: true,
        storedFiles: true
      }
    });
    await prisma.folders.update({
      where: { id: folder.id },
      data: { inTrash: false }
    });
    if (folder.childFolder.length > 0) {
      for (const f of folder.childFolder) {
        if (f.isDeleted == false) {
          await updateToTrash(f.id);
        }
      }
    }
    if (folder.storedFiles.length > 0) {
      for (const f of folder.storedFiles) {
        await prisma.files.update({
          where: { id: f.id },
          data: { inTrash: false }
        });
      }
    }
  };
  await updateToTrash(id);
  const result = { isSuccess: true, msg: "Folder restore successful" };
  res.status(200).json(result);
});

router.post("/copy", protect, async (req, res, next) => {
  try {
    const copyFolder = {
      id: req.body.id,
      destinationFolderId: (() =>
        req.body.destinationFolderId ? req.body.destinationFolderId : null)(),
      parentFolderId: req.body.parentFolderId,
      name: req.body.name
    };
    let processedIds = [];
    const recursiveFunc = async (folderObj) => {
      if (processedIds.includes(folderObj.id)) return;
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
      processedIds.push(newFolder.id);
      if (folder.childFolder.length > 0) {
        const cfl = folder.childFolder.length;
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
    const result = { isSuccess: true, msg: "Folder copy successful" };
    res.status(200).json(result);
  } catch (error) {
    const result = { isSuccess: false, msg: "Folder copy unccessful" };
    res.status(200).json(result);
  }
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
      name: newName,
      inTrash: false
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
router.put("/to-trash/:id", protect, async (req, res, next) => {
  const { id } = req.params;
  await prisma.folders.update({ where: { id: id }, data: { isDeleted: true } });
  const updateToTrash = async (paramId) => {
    // find the folderId
    const folder = await prisma.folders.findFirst({
      where: { id: paramId },
      include: {
        childFolder: true,
        storedFiles: true
      }
    });
    await prisma.folders.update({
      where: { id: folder.id },
      data: { inTrash: true }
    });
    if (folder.childFolder.length > 0) {
      for (const f of folder.childFolder) {
        await updateToTrash(f.id);
      }
    }
    if (folder.storedFiles.length > 0) {
      for (const f of folder.storedFiles) {
        await prisma.files.update({
          where: { id: f.id },
          data: { inTrash: true }
        });
      }
    }
  };
  await updateToTrash(id);
  const result = { isSuccess: true, msg: "Folders move to trash successful" };
  res.status(200).json(result);
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
router.delete("/delete/:id", protect, async (req, res, next) => {
  const id = req.params.id;
  const deleteFolder = async (folderId) => {
    const folderData = await prisma.folders.findUnique({
      where: { id: folderId },
      include: {
        childFolder: true,
        allowedUsers: true,
        storedFiles: true
      }
    });
    if (folderData.storedFiles.length > 0) {
      for (const f of folderData.storedFiles) {
        if (f.isDeleted != true) {
          const file = await prisma.files.delete({ where: { id: f.id } });
        }
      }
    }
    if (folderData.childFolder.length == 0) {
      const folder = await prisma.folders.delete({
        where: { id: folderId }
      });
      return;
    }
    for (const f of folderData.childFolder) {
      if (f.isDeleted != true) {
        await deleteFolder(f.id);
      }
    }
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
