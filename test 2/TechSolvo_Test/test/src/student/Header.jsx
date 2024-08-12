import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, TextField, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {  allStudentDataForCSV} from "../store/APIs/API";
import debounce from 'lodash.debounce'
import { createStudents } from "../store/APIs/API";

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string()
  .matches(/^[A-Za-z\s]+$/, "Name must only contain alphabetic characters")
  .required("Name is required"),
  fatherName: Yup.string()
  .matches(/^[A-Za-z\s]+$/, "Father's name must only contain alphabetic characters")
  .required("Father's Name is required"),
  age: Yup.number().required("Age is required").positive("Age must be positive").integer("Age must be an integer"),
  gender: Yup.string().oneOf(['male', 'female', 'other'], 'Invalid gender').required("Gender is required")
});

const Header = () => {
  const [student, setStudent] = useState(false);
  const [open, setOpen] = useState(false);
  const[loading,setLoading]=useState(false)
  const[addFormData,setAddFormData]=useState([]);
  const[teacherId,setTeacherId] = useState('');

  const handleAddStudentClick = () => {
    setStudent(true);
  };

  const handleExportData = () => {
    downloadCSVFile();
  };

  const handleClose = () => {
    setStudent(false);
  };

  const handleCloseSnackBar = () => {
    setOpen(false);
  };

  const handleSubmit = (values, { resetForm }) => {
    setAddFormData(values)
    setOpen(true);
    resetForm();
    createStudent()
    handleClose();
  };

  const createStudent = debounce(async () => {
    try {
      const result = await createStudents(addFormData.name,  addFormData.fatherName, addFormData.gender, addFormData.age,teacherId);
      if (!result) {
        console.error('Unable to fetch API');
      }
      setLoading(false);
    } catch (error) {
      console.error('An error occurred:', error);
    } 
  }, 1000);








  useEffect(()=>{
    const userData = localStorage.getItem('userData');
    
    if (userData) {
      const parsedData = JSON.parse(userData); 
      setTeacherId(parsedData?.teacher_id,' '); 
    }
  },[])


  const downloadCSVFile = debounce(async () => {   
    setLoading(true);
    
    try {
      const response = await allStudentDataForCSV(teacherId, true);
      if (!response) {
        console.error('Unable to fetch API');
        setLoading(false);
        return;
      }
      const reader = response?.body?.getReader();
  const totalSize = Number(response.headers.get('content-length'));
  let downloadedSize = 0;
  const chunks = [];

  let result;
  while (!(result = await reader.read()).done) {
    const { value } = result;
    downloadedSize += value.length;
    chunks.push(value);

    const progressPercentage = (downloadedSize / totalSize) * 100;
  }

  const blob = new Blob(chunks, { type: 'text/csv' });


  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `students.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log('Download completed successfully.');
    }


      catch(e){
        console.error(e)
      }
  

  }, 1000);

  return (
    <>
      <Box
        sx={{
          height: "8vh",
          width: "100%",
          display: "flex",
          justifyContent:'right',
          alignItems: "center",
          flexDirection: "row",
          gap: "20px",
        }}
      >
        <Button
          sx={{ textAlign: "left" }}
          startIcon={<PersonAddIcon />}
          variant="contained"
          onClick={handleAddStudentClick}
        >
          {" "}
          Add Student
        </Button>
        <Button
          sx={{ textAlign: "left" }}
          startIcon={<FileUploadIcon />}
          variant="contained"
          onClick={handleExportData}
        >
          {" "}
         Download CSV File
        </Button>
      </Box>
      <Divider sx={{ width: "100%" }} />

      <Dialog onClose={handleClose} open={student}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: '500' }}>Add a new Student</Typography>
          <CloseIcon sx={{ cursor: 'pointer', fontSize: '1.5rem' }} onClick={handleClose} />
        </Box>
        <Formik
          initialValues={{ name: '', fatherName: '', age: '', gender: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <DialogContent
                sx={{
                  width: '500px',
                  height: '420px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  padding: '20px'
                }}
              >
                <Box>
                  <Field
                    as={TextField}
                    name="name"
                    label="Enter Name"
                    variant="outlined"
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={<ErrorMessage name="name" />}
                  />
                </Box>
                <Box>
                  <Field
                    as={TextField}
                    name="fatherName"
                    label="Father's Name"
                    variant="outlined"
                    fullWidth
                    error={touched.fatherName && Boolean(errors.fatherName)}
                    helperText={<ErrorMessage name="fatherName" />}
                  />
                </Box>
                <Box>
                  <Field
                    as={TextField}
                    name="age"
                    label="Age"
                    variant="outlined"
                    fullWidth
                    type="number"
                    error={touched.age && Boolean(errors.age)}
                    helperText={<ErrorMessage name="age" />}
                  />
                </Box>
                <Box>
                  <Field
                    as={TextField}
                    name="gender"
                    label="Gender"
                    variant="outlined"
                    fullWidth
                    error={touched.gender && Boolean(errors.gender)}
                    helperText={<ErrorMessage name="gender" />}
                  />
                </Box>
                <Button variant="contained" type="submit">Submit</Button>
              </DialogContent>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackBar}>
        <Alert
          onClose={handleCloseSnackBar}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Your Form is Submitted Successfully.
        </Alert>
      </Snackbar>
    </>
  );
};

export default Header;

