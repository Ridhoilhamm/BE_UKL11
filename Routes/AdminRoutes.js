import express from "express";
import { refreshToken } from "../controllers/RefreshToken.js";
import { register, login, logout } from "../controllers/Auth.js";
import {
  getAllAdmin,
  deleteAdmin,
  updateEmailAdmin,
  updatePasswordAdmin,
} from "../controllers/Admin.js";
import { verifyToken } from "../middleware/Verify.js";

const AdminRoute = express.Router();


AdminRoute.get("/admin", getAllAdmin);
AdminRoute.put("/admin/password/:id", verifyToken, updatePasswordAdmin);
AdminRoute.put("/admin/email/:id", verifyToken, updateEmailAdmin);
AdminRoute.delete("/admin/delete/:id", verifyToken, deleteAdmin);


AdminRoute.post("/register", register);
AdminRoute.post("/admin/auth", login);
AdminRoute.get("/token", refreshToken);
AdminRoute.delete("/logout", logout);

export default AdminRoute;
