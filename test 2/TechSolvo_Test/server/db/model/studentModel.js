import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";
const student = sequelize.define("student", {
    student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement:true
  },

  student_name: {
    type: DataTypes.STRING,
  },
  father_name: {
    type: DataTypes.STRING,
  },

  age: {
    type: DataTypes.INTEGER,
  },
  teacher_id: {
    type: DataTypes.INTEGER,
  },

  gender: {
    type: DataTypes.STRING,
  },
},
{
    timestamps:false
});
// user.create({
//   email: "ranveer@example.com",
//   fullName: "Ranveer Nayak",
//   age: 30,
//   employed: true,
// });
export { student };
