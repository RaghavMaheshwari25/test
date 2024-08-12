import { student } from "../db/model/studentModel.js";
import { teacher } from "../db/model/teacherModel.js";
import { parse } from 'json2csv';
const userController = {
  async getAllUsers(req, res) {
    try {
      const { teacherId, isCsvDownload } = req.query;
      const students = await student.findAll({
        attributes: ['student_id', 'student_name', 'father_name', 'age', 'gender'],
        where: { teacher_id:teacherId }
      });
  
      if (isCsvDownload === 'true') {
        // Convert JSON to CSV
        const csv = parse(students.map(student => student.toJSON()));
  
        // Set headers for CSV file download
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=students.csv');
        res.status(200).send(csv);
      } else {
        // Send JSON response
        res.status(200).json(students);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async addUser(req, res) {
    try {
      const {studentId, studentName, fatherName, age, gender, teacherId } = req.query;
      const newUser = await student.create({ student_id:studentId,student_name: studentName, father_name:fatherName, age, gender, teacher_id:teacherId });
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },


  
  async teacherSignup(req, res) {
    try {
      const { teacherEmail, teacherPassword,teacherId } = req.query;
      const newUser = await teacher.create({ teacher_id: teacherId,teacher_email:teacherEmail, password:teacherPassword });
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async teacherLogin(req, res) {
    try {
      const { teacherEmail, teacherPassword } = req.query;
      const teacherData = await teacher.findOne({
        where: {
          teacher_email: teacherEmail,
          password: teacherPassword
        }
      });
      
      if (!teacherData) {
        return res.status(404).json("Teacher not Found");
      }
      res.status(201).json({success:'Login successfully',teacherData});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },


  async deleteUser(req, res) {
    try {
      await student.destroy({
        where: {
          student_id: req.query.studentId,
        },
      });
      res.status(201).json("user delete success");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async UpdateUser(req, res) {
    try {
      const {studentId} = req.query;
      const userExist = await student.findByPk(studentId);
      if (!userExist) {
        return res.status(404).json("User not Found");
      }
      const {studentName, fatherName, age, gender, teacherId } = req.query;
      await student.update(
        { student_name:studentName, father_name:fatherName, age:age, gender:gender , teacher_id:teacherId},
        {
          where: { student_id: studentId },
        }
      );
      res.status(201).json("User updated successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
export { userController };
