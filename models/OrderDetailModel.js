import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import OrderList from "./OrderListModel.js";
import Food from "./FoodModel.js";

const {DataTypes} = Sequelize;

const OrderDetail = db.define('order_detail',{
    orderListId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    foodId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    quantity:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    price:{
        type: DataTypes.DOUBLE,
        validate: {
            min: 0
        }
    },
},{
    freezeTableName: true
}) 

OrderList.hasMany(OrderDetail, { as: 'order_details' });
OrderDetail.belongsTo(OrderList, { as: 'order_list', foreignKey: 'orderListId' });

Food.hasMany(OrderDetail, { as: 'order_details' });
OrderDetail.belongsTo(Food, { as: 'food', foreignKey: 'foodId' });

export default OrderDetail;