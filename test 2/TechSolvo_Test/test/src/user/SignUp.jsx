import { Box, Button, TextField, Typography } from '@mui/material'
import React from 'react'
import { useState } from 'react';
import * as Yup from 'yup';
import debounce from 'lodash.debounce'
import { createTeachers } from '../store/APIs/API';
const SignUp = () => {
    const [emailError, setEmailError] = useState('');
    const [password,setPassword] = useState('')
    const [passwordError,setPasswordError] = useState('')
    const [email, setEmail] = useState('');

    const validationSchema = Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
    });
    
    const validateEmail = () => {
        try {
          validationSchema.validateSync({ email });
          setEmailError('');
        } catch (error) {
          setEmailError(error.message); 
        }
      };

      const validatePassword = async () => {
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
          createTeacher();
          setEmail('')
          setPassword('')

        }
        else{
          console.log(email,'else')

        }
  
      };
      
      const createTeacher = debounce(async () => {
        try {
          const result = await createTeachers(email, password);

       

          if (!result) {
            console.error('Unable to fetch API');
          }
          // setLoading(false); 

  
          console.log(result, 'Teacher created successfully');
        } catch (error) {
          console.error('An error occurred:', error);
        }
        setEmail('')
        setPassword('')
      }, 1000);


  return (
<>
<Box sx={{height:'100vh',width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
<Box sx={{height:'100vh',width:'65%'}}>
<img src='imageForSignup.jpeg' alt='login' style={{width:'100%',height:'100vh'}}/>
</Box>
<Box sx={{display:'flex',flexDirection:"column",gap:'35px',width:'35%',paddingRight:'50px'}}>
<Typography sx={{fontSize:'1.5rem'}}>Welcome! to the Student Portal Please Sign in to start the adventure</Typography>
<TextField id="outlined-basic" label="Enter Email" variant="outlined" value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            onBlur={validateEmail}  />

<TextField id="outlined-basic" label="Enter Password" variant="outlined" onChange={(e)=>setPassword(e.target.value)} />  
  {passwordError && <Typography sx={{color:'red',marginTop:'-2rem',marginLeft:'13px'}}>{passwordError}</Typography>}

    {/* <TextField
      id="outlined-basic"
      label="Enter Password"
      variant="outlined"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      error={!!passwordError}
      helperText={passwordError}
      onBlur={validatePassword}
    /> */}
<Button variant='contained' type='submit' onClick={handleSubmit}>Sign Up</Button>
</Box>
</Box>
</>
  )
}

export default SignUp