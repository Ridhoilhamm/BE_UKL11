import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./config/Database.js";
import AdminRoute from "./Routes/AdminRoutes.js";
import foodRoute from "./Routes/FoodRoute.js";
import OrderRoute from "./Routes/OrderRoute.js";
// import Admin from "./models/AdminModel.js";
// import Food from "./models/FoodModel.js";
import OrderDetail from "./models/OrderDetailModel.js";
import OrderList from "./models/OrderListModel.js";
// import userRoute from "./routes/UserRoute.js";
const app = express();
dotenv.config();

try {
    await db.authenticate();
    console.log("Database connect");
    // await db.sync();
    // await db.sync({alter: true});
} catch (error) {
    console.error(error);
}

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))
app.use(cookieParser());
app.use(express.json());
app.use(AdminRoute);
app.use(foodRoute);
app.use(OrderRoute);
// app.use(ApprovalFranchiseRoute);

app.listen(8000, ()=>{
    console.log("server run at port 8000");
})