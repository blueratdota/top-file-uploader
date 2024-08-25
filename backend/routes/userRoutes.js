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
    httpOnly: true,
    expires: new Date(0)
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
        Files: true
      }
    });
    console.log("user successful GET");
    res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
});

// update user list of shared folders
router.put("/share-to-user", async (req, res, next) => {
  // verify if the req.user.id == author of the folder being shared
  const { name, folderIdToShare } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { name: name },
      include: {
        ownedFolders: true,
        sharedFolders: true,
        Files: true
      }
    });
    const folder = await prisma.folders.findFirst({
      where: { id: folderIdToShare }
      // include: { childFolder: true }
    });

    const updateSharedFolders = await prisma.user.update({
      where: { id: user.id },
      data: {
        sharedFolders: {
          connect: folder
        }
      }
    });

    // recursively add to sharedFolders the childfolders of shared folder
    // const addToSharedFolders = async (folder) => {
    //   // console.log("folder.childFolder", [folder.childFolder].length);

    //   if ([folder.childFolder].length == 0 || !folder.childFolder) {
    //     let newFolder = folder;
    //     delete folder.childFolder;
    //     await prisma.user.update({
    //       where: { id: user.id },
    //       data: {
    //         sharedFolders: {
    //           connect: newFolder
    //         }
    //       }
    //     });
    //   } else {
    //     folder.childFolder.forEach(async (f) => {
    //       await addToSharedFolders(f);
    //     });
    //   }
    // };
    // await addToSharedFolders(folder);

    res.status(200).json(folder);
  } catch (error) {
    console.log(error);
  }
});

export default router;
