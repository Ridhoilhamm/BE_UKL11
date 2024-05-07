import {Sequelize} from "sequelize"

const db = new Sequelize('food_ordering2', 'root', '', {
    host: "localhost", 
    dialect: "mysql"
})

export default db;