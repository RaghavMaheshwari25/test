import axios from 'axios';
import headers from './Headers';

let x = 2050;
export async function createTeachers(teacherEmail, teacherPassword) {
    x++;
    try {
      const response = await axios.post(
        `http://localhost:8081/teacher-signup?teacherEmail=${teacherEmail}&teacherPassword=${teacherPassword}&teacherId=${x}`,
        { headers }
      );
      return response?.data;
    } catch (error) {
      console.error('Error creating teacher:', error.response ? error.response.data : error.message);
      throw error; 
    }
  }
  


  export async function createStudents(studentName,fatherName, gender, age,teacherId) {
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  let uniqueInt = getRandomInt(1, 1000);
    try {
      const response = await axios.post( 
        `http://localhost:8081/?studentName=${studentName}&fatherName=${fatherName}&gender=${gender}&age=${age}&teacherId=${teacherId}&studentId=${uniqueInt}`,
        { headers }
      );
  
      return response?.data;
    } catch (error) {
      console.error('Error', error);
    }
  }

    export async function teacherLogin(teacherEmail,teacherPassword) {
    try {
      const res = await axios.get(
        ` http://localhost:8081/teacher-login?teacherEmail=${teacherEmail}&teacherPassword=${teacherPassword}`,
        { headers }
      );
      return res;
    }
    catch (err) {
      console.error(err)
      alert('Sorry! This email id and password is wrong')
      return err;
    }
  }
  export async function allStudentData(teacherId,downloadCSV) {
    try {
      const res = await axios.get(
        `http://localhost:8081/?teacherId=${teacherId}&isCsvDownload=${downloadCSV}`,
        { headers }
      );
      return res;
    }
    catch (err) {
      console.error(err)
      return err;
    }
  }



  export async function allStudentDataForCSV(teacherId, downloadCSV) {
    try {
      const response = await fetch(
        `http://localhost:8081/?teacherId=${teacherId}&isCsvDownload=${downloadCSV}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', 
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return response;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  export async function studentDelete(studentId) {
    try {
      const res = await axios.delete(
        ` http://localhost:8081/?studentId=${studentId}`,
        { headers }
      );
      return res;
    }
    catch (err) {
      console.error(err)
      alert('Sorry! This email id and password is wrong')
      return err;
    }
  }

  export async function studentUpdate(studentId,studentName,fatherName,age,gender,teacherId) {
    console.log('inside api')
    try {
      const res = await axios.put(
        ` http://localhost:8081/?studentId=${studentId}&studentName=${studentName}&fatherName=${fatherName}&age=${age}&gender=${gender}&teacherId=${teacherId}`,
        { headers }
      );
      return res;
    }
    catch (err) {
      console.error(err)
      return err;
    }
  }