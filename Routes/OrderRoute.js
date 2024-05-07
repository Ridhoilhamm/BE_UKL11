import express from "express";
import { verifyToken } from "../middleware/Verify.js";
import { createOrder, getAllOrders } from "../controllers/Order.js";

const OrderRoute = express.Router();

OrderRoute.get("/order", getAllOrders);
OrderRoute.post("/order", createOrder);

export default OrderRoute;
