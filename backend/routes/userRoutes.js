import express from "express";
import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";
import { genToken } from "../utils/generateToken.js";
import { PrismaClientValidationError } from "@prisma/client/runtime/react-native.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
const prisma = new PrismaClient();

router.post("/signup", async (req, res, next) => {
  const { name, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name: name, password: hashedPassword }
    });
    genToken(res, name);
    res.status(200).json(user);
  } catch (error) {
    const err = new Error(
      `the name"${name}" is already used by a different user`
    );
    err.status = 409;
    next(err);
  }
});

// login account
// api/users/login @POST
router.post("/login", async (req, res, next) => {
  const { name, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { name: name } });
    // user returns
    // {
    //   id: '1b525bd4-da0f-43f1-828f-1deaae8c5b12',
    //   name: 'bianca',
    //   password: '$2a$10$dEaNXcglm8rslyqFXgEzbeCB15Om67sxDgvVl/9cgOQ05FRrPMyGG'
    // }
    if (!user) {
      const error = new Error("User does not exist");
      error.status = 401;
      return next(error);
    }
    // check password if passwowrd entry is correct
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error("Password is incorrect");
      error.status = 401;
      return next(error);
    }
    genToken(res, user.name);
    console.log(`#####login posted by username: ${user.id}`);
    res.json(user);
  } catch (error) {
    return next(error);
  }
});

// login account
// api/users/logout @POST
router.post("/logout", async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: false,
    expires: new Date(0),
    sameSite: "none"
  });
  res.json({ message: `User: logged-out` });
});

// get account details
// api/users/profile @GET
router.get("/profile", protect, async (req, res, next) => {
  console.log("PROTECT IS SATISFIED FOR USER:", req.user.name);
  try {
    // console.log(req.user);
    const user = await prisma.user.findUnique({
      where: { name: req.user.name },
      include: {
        ownedFolders: true,
        sharedFolders: true,
        sharedFiles: true,
        Files: true
      }
    });
    console.log("user successful GET");
    res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
});

// check if user exists in DB
router.get("/check/:name", async (req, res, next) => {
  console.log(`query if name: ${req.params.name} exists on DB`);
  try {
    const user = await prisma.user.findUnique({
      where: { name: req.params.name },
      select: { name: true, id: true }
    });
    console.log({ user });

    res.status(200).json({
      data: user,
      status: user ? "User exists" : "User does not exist"
    });
  } catch (error) {
    return next(error);
  }
});

// update user list of shared folders
router.put("/share-to-user", async (req, res, next) => {
  // verify if the req.user.id == author of the folder being shared
  const { name, folderIdToShare, fileIdToShare } = req.body;
  console.log(`shared folder to ${name}`);
  try {
    const user = await prisma.user.findUnique({
      where: { name: name },
      include: {
        ownedFolders: true,
        sharedFolders: true,
        sharedFiles: true,
        Files: true
      }
    });
    if (folderIdToShare) {
      const folder = await prisma.folders.findFirst({
        where: { id: folderIdToShare }
      });

      const updateSharedFolders = await prisma.user.update({
        where: { id: user.id },
        data: {
          sharedFolders: {
            connect: folder
          }
        }
      });
    }
    if (fileIdToShare) {
      const file = await prisma.files.findFirst({
        where: { id: folderIdToShare }
      });

      const updateSharedFiles = await prisma.user.update({
        where: { id: user.id },
        data: {
          sharedFiles: {
            connect: file
          }
        }
      });
    }

    const result = { isSuccess: true, msg: "Folder/File share successful" };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});

// update user list of shared folders
router.put("/unshare-to-user", async (req, res, next) => {
  // verify if the req.user.id == author of the folder being shared
  const { name, folderIdToShare, fileIdToShare } = req.body;
  console.log(`unshared folder to ${name}`);
  try {
    const user = await prisma.user.findUnique({
      where: { name: name },
      include: {
        ownedFolders: true,
        sharedFolders: true,
        sharedFiles: true,
        Files: true
      }
    });
    if (folderIdToShare) {
      const folder = await prisma.folders.findFirst({
        where: { id: folderIdToShare }
      });

      const updateSharedFolders = await prisma.user.update({
        where: { id: user.id },
        data: {
          sharedFolders: {
            disconnect: folder
          }
        }
      });
    }
    if (fileIdToShare) {
      const file = await prisma.files.findFirst({
        where: { id: folderIdToShare }
      });

      const updateSharedFiles = await prisma.user.update({
        where: { id: user.id },
        data: {
          sharedFiles: {
            connect: file
          }
        }
      });
    }

    const result = { isSuccess: true, msg: "Folder/File unshare successful" };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});

export default router;
