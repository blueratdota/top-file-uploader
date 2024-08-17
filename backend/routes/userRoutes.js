import express from "express";
import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";
import { genToken } from "../utils/generateToken.js";
import { PrismaClientValidationError } from "@prisma/client/runtime/react-native.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
const prisma = new PrismaClient();

// get data via id
// api/users/;id @GET
// router.get("/:id", async (req, res, next) => {
//   const userId = req.params.id;
//   const userData = await prisma.user.findMany({
//     where: { id: userId },
//     include: { Folders: true }
//   });
//   res.status(200).json(userData);
// });

// create account
// api/users/signup @POST
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
    next(error);
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
  console.log("run next after protect");
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
    console.log(user);
    res.status(200).json(user);
  } catch (error) {}
});

export default router;
