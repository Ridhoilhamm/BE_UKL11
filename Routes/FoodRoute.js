import express from "express";
import {
  addFood,
  getAllFood,
  findFood,
  updateFood,
  deleteFood,
} from "../controllers/Food.js";
import upload from "../middleware/MulterConfig.js";
import { verifyToken } from "../middleware/Verify.js";

const foodRoute = express.Router();

foodRoute.get("/food/get/", getAllFood);
foodRoute.get("/food/:key", findFood);
foodRoute.post("/food", verifyToken, upload.single("image"), addFood);
foodRoute.put(
  "/food/update/:id",
  verifyToken,
  upload.single("image"),
  updateFood
);
foodRoute.delete(
  "/food/delete/:id",
  verifyToken,
  upload.single("image"),
  deleteFood
);

export default foodRoute;
