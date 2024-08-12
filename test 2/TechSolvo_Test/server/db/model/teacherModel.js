import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";
const teacher = sequelize.define("teacher", {
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  teacher_email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
},{
    timestamps:false
});
// user.create({
//   email: "ranveer@example.com",
//   fullName: "Ranveer Nayak",
//   age: 30,
//   employed: true,
// });
export { teacher };
