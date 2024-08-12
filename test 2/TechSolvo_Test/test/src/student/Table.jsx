import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import Header from './Header';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Dialog, DialogContent, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { allStudentData,studentDelete, studentUpdate } from '../store/APIs/API';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import debounce from 'lodash.debounce'
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  fatherName: Yup.string().required("Father's Name is required"),
  age: Yup.number().required('Age is required').min(1, 'Age must be greater than 0'),
  gender: Yup.string().required('Gender is required'),
});

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'code', label: 'Student ID', minWidth: 100 },
  {
    id: 'population',
    label: 'Age',
    minWidth: 170,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Father Name',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'density',
    label: 'Gender',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'edit',
    label: 'Edit',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'delete',
    label: 'Delete',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}


export default function StickyHeadTable() {

  const [page, setPage] = React.useState(0);
  const [editIcon,setEditIcon] = useState(false)
  const [deleteIcon,setDeleteIcon] = useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = useState([]);
  const[loading,setLoading]=useState(false)
  const [rows, setRows] = useState([]); 
  const[teacherId,setTeacherId] = useState('');
  const[studentId,setStudentId] = useState()
  const[studentIdForEdit,setStudentIdForEdit] = useState()
  
  
  const [formValues, setFormValues] = useState({
    name: '',
    fatherName: '',
    age: '',
    gender: ''
  });

  const [errors, setErrors] = useState({});
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    try {
      await validationSchema.validateAt(name, { [name]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    } catch (err) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: err.message }));
    }
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleClose = () => {
    setEditIcon(false);
    setDeleteIcon(false);
  };

const handleEditIcon = (row)=>{
setStudentIdForEdit(row?.code)
  setEditIcon(true)
}
const handleDeleteIcon = (row)=>{
  setStudentId(row?.code)
  setDeleteIcon(true)
}
useEffect(()=>{
  const userData = localStorage.getItem('userData');
  
  if (userData) {
    const parsedData = JSON.parse(userData); 
    setTeacherId(parsedData?.teacher_id,' '); 
  }
},[])


const downloadCSV = false;
useEffect(() => {
  const getAllStudent = async () => {
    setLoading(true)
    try {
      const result = await allStudentData(teacherId,downloadCSV);
      if (!result) {
        console.error('unable to fetch API')
      }
      setLoading(false)
      setData(result?.data)

      setRows(result?.data?.map(item => createData(item?.student_name,item?.student_id, item?.age, item?.father_name, item?.gender)));
    } catch (e) {
      console.error('Error', e)
    }
  }
  getAllStudent()
}, [teacherId])

const handleDeleteAPI = debounce(async () => {
  try {
    const result = await studentDelete(studentId);
    if (!result) {
      console.error('Unable to fetch API');
    }
    setLoading(false);
  } catch (error) {
    console.error('An error occurred:', error);
  } 
  handleClose();
}, 1000);



const updateStudentAPI = debounce(async () => {
  try {
    const result = await studentUpdate( studentIdForEdit,formValues?.name, formValues?.fatherName, formValues?.age, formValues?.gender,teacherId);
    if (!result) {
      console.error('Unable to fetch API');
    }
    setLoading(false);
  } catch (error) {
    console.error('An error occurred:', error);
  } 
}, 1000);

 

  return (
    <>
      {data? (
        <>
   <Header/>
    <Paper sx={{ width: '96%', overflow: 'auto',marginTop:"50px",marginLeft:"23px",marginRight:'10px' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows
              // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                        {column.id==='delete' && <DeleteIcon sx={{cursor:'pointer'}} onClick={(e)=>handleDeleteIcon(row)} />} 
                        {column.id==='edit' && <EditIcon sx={{cursor:'pointer'}} onClick={(e)=>handleEditIcon(row)}/>} 
                          {
                          column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>


  

        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </>
      ):(
        <Box sx={{height:'100vh',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
          <CircularProgress/>
        </Box>
      )
     
    
    }


    {/* FOR EDIT ICON HERE TO */}

{
editIcon &&
    <Dialog  open={editIcon} onClose={handleClose}>
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
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: '500' }}>Update Student</Typography>
          <CloseIcon sx={{ cursor: 'pointer', fontSize: '1.5rem' }} onClick={handleClose} />
        </Box>
        <TextField
            id="outlined-name"
            label="Enter Name"
            variant="outlined"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
          <TextField
            id="outlined-fatherName"
            label="Father's Name"
            variant="outlined"
            name="fatherName"
            value={formValues.fatherName}
            onChange={handleChange}
            error={Boolean(errors.fatherName)}
            helperText={errors.fatherName}
          />
          <TextField
            id="outlined-age"
            label="Age"
            variant="outlined"
            name="age"
            value={formValues.age}
            onChange={handleChange}
            error={Boolean(errors.age)}
            helperText={errors.age}
          />
          <TextField
            id="outlined-gender"
            label="Gender"
            variant="outlined"
            name="gender"
            value={formValues.gender}
            onChange={handleChange}
            error={Boolean(errors.gender)}
            helperText={errors.gender}
          />
                <Button variant="contained" type="submit" onClick={updateStudentAPI}>Update</Button>
              </DialogContent>
      </Dialog>}

      {/* HERE */}



    {/* FOR DELETE ICON HERE TO */}

{
deleteIcon &&
    <Dialog  open={deleteIcon} onClose={handleClose}>
    <DialogContent
                sx={{
                  width: '400px',
                  height: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  padding: '20px'
                }}
              >
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: '500' }}>Are you sure want to delete the student ?</Typography>
        </Box>
        <Box sx={{display:'flex',marginLeft:'auto',gap:'30px'}}>
                <Button variant="contained" type="submit" onClick={handleDeleteAPI}>Yes</Button>
                <Button variant="contained" type="submit" onClick={handleClose}>No</Button>
        </Box>
              </DialogContent>
      </Dialog>}

      {/* HERE */}
    </>
  );
}