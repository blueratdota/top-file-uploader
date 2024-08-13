import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
//import routes
import userRoutes from "./routes/userRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";

const app = express();
const corsOptions = {
  origin: "http://localhost:5173", // Change to your frontend's URL
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
};
const port = process.env.PORT || 3001;
// since not using cmjs - use this
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(`### pathname is: ${__filename}`);

// body parser middleware
// must be before other
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));
// api endpoints
app.use("/api/users", userRoutes);
app.use("/api/folders", folderRoutes);

// use error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`### server is running on port: ${port}`);
});
