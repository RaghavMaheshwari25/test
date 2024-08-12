import { Box, Button, TextField, Typography } from '@mui/material'
import React from 'react'
import { useState,useEffect } from 'react';
import { teacherLogin } from '../store/APIs/API';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import debounce from 'lodash.debounce'
import { useNavigate } from 'react-router-dom'; 
const Login = () => {
    const [emailError, setEmailError] = useState('');
    const [email, setEmail] = useState('');
    const [loading,setLoading] = useState(false)
    const [password,setPassword] = useState('')
    const [passwordError,setPasswordError] = useState('')
    const [data,setData] = useState([])
    const [callAPI,setCallAPI] = useState(false)
    const navigate = useNavigate(); 
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required')
      });
    const validateEmail = () => {
        try {
          validationSchema.validateSync({ email });
          setEmailError('');
        } catch (error) {
          setEmailError(error.message); 
        }
      };

      const validatePassword = async (e) => {
        if(password==='')
        {
          setPasswordError('Password is required')
        }
        else{
          setPasswordError('')
        }
      };

      const handleSubmit = (event) => {
        event.preventDefault();
        validateEmail();
        validatePassword();
    if(emailError==='' && passwordError==='' && email!=='' && password!=='' ){
   loginAPI()
    }
   
      };

      const loginAPI = debounce(async () => { 
        setLoading(true)
        try {
          const result = await teacherLogin(email,password);
          if (!result) {
            console.log('unable to fetch api')
          }
          setLoading(false)
          setData(result?.data)
         if(result?.data){
          localStorage.setItem('userData', JSON.stringify(result?.data?.teacherData));
          navigate('/table');
         }
    
        } catch (e) {
          console.error('Error', e)
        }
        setEmail('');
        setPassword('');
        
       }, 1000);
      


  return (
<>
<Box sx={{height:'100vh',width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
<Box sx={{height:'100vh',width:'65%'}}>
<img src='ImageForLogin.jpeg' alt='login' style={{width:'100%',height:'100vh'}}/>
</Box>
<Box sx={{display:'flex',flexDirection:"column",gap:'35px',width:'35%',paddingRight:'50px'}}>
<Typography sx={{fontSize:'1.5rem'}}>Welcome! to the Student Portal Please Sign in to start the adventure</Typography>
<TextField id="outlined-basic" label="Enter Email" variant="outlined" value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            onBlur={validateEmail}  />
<TextField id="outlined-basic" label="Enter Password" variant="outlined" onChange={(e)=>setPassword(e.target.value)}/>
{passwordError==='' && <Typography sx={{color:'red',marginTop:'-2rem',marginLeft:'13px'}}>{passwordError}</Typography>}
<Button variant='contained' type='submit' onClick={handleSubmit}>Login</Button>
<Typography>
          Don't have an account? Click here to <Link to="/signup" style={{ cursor: 'pointer', color: '#1664C0' }}>Sign Up</Link>
        </Typography>
</Box>
</Box>
</>
  )
}

export default Login