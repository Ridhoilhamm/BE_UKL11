import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Food = db.define('food',{
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    spicy_level:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    price:{
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    image:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
},{
    freezeTableName: true
}) 

export default Food;