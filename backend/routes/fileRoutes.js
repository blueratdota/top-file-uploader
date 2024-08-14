import multer from "multer";
import express from "express";
const router = express.Router();
const upload = multer({ dest: "uploads" });

router.post("/upload", upload.single("file"), (req, res, next) => {
  console.log(req.body);
});
export default router;
