import React from 'react';
import Grid from '@mui/material/Grid';
import { Button, FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Forgot Password Schema
  const ForgotPasswordSchema = Yup.object().shape({
    email:Yup.string().required('Email is required'),
    username:Yup.string().required('Email is required'),
    password:Yup.string().required('Password is required'),
    confirm_password:Yup.string().required('Confirm Password is required').oneOf(
      [Yup.ref('password'), ''],'Please provide the same password as above'),
  });
  
  const handleSubmit = async (values) => {
    try {
      const { status} = await axios.post("/users/reset_password", values);
      if(status === 200){ navigate('/login')}
    } catch (error) {
      window.alert(error || 'Invalid Details Provided')
    }
  }

  return (
    <Grid container xs={12} md={3.5} my={10} mx={'auto'}  flex={1} >
      <Formik
        enableReinitialize
        initialValues={{
          email:'',
          username:'',
          password:'',
          confirm_password:'',
          userType:'user'
        }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={values => {handleSubmit(values);}}>
        {({ errors, touched, values,setFieldValue }) => (
        <Form>
          <Grid item container spacing={2} py={7} px={4} alignItems={'flex-start'} mx={'auto'}
            sx={{boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em;', borderRadius:'10px'}}>
          <Grid item xs={12} md={12}>
            <Typography variant='h4' sx={{fontWeight:'bold', textAlign:'center',color:'rgb(221, 132, 38)'}}>Forgot Password</Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth>
              <FormLabel sx={{m:0, fontWeight:500,color:'rgb(221, 132, 38)'}} >Email</FormLabel>
              <TextField name='email' placeholder='Enter Email' variant="outlined" type='email'
                onChange={(e) => setFieldValue('email',e?.target?.value)}
              />
              {touched?.email && errors?.email && <FormHelperText sx={{my:1,color:'red',mx:0,fontSize:14}}>
                {errors?.email}
              </FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth>
              <FormLabel sx={{m:0, fontWeight:500,color:'rgb(221, 132, 38)'}} >Username</FormLabel>
              <TextField name='username' placeholder='Enter Username' variant="outlined" 
                onChange={(e) => setFieldValue('username',e?.target?.value)}
              />
              {touched?.username && errors?.username && <FormHelperText sx={{my:1,color:'red',mx:0,fontSize:14}}>
                {errors?.username}
              </FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth>
              <FormLabel sx={{m:0, fontWeight:500,color:'rgb(221, 132, 38)'}} >Password</FormLabel>
              <TextField name='password' placeholder='Enter Password' variant="outlined" 
                onChange={(e) => setFieldValue('password',e?.target?.value)}
              />
              {touched?.password && errors?.password && <FormHelperText sx={{my:1,color:'red',mx:0,fontSize:14}}>
                {errors?.password}
              </FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth>
              <FormLabel sx={{m:0, fontWeight:500,color:'rgb(221, 132, 38)'}} >Confirm Password</FormLabel>
              <TextField name='confirm_password' placeholder='Enter Confirm Password' variant="outlined" 
                onChange={(e) => setFieldValue('confirm_password',e?.target?.value)}
              />
              {touched?.confirm_password && errors?.confirm_password && <FormHelperText sx={{my:1,color:'red',mx:0,fontSize:14}}>
                {errors?.confirm_password}
              </FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
          <FormControl fullWidth>
            <Typography sx={{m:0, fontWeight:500, width:'100%', color:'rgb(221, 132, 38)'}}>User Type</Typography>
            <RadioGroup row 
              name={'userType'}
              defaultValue={'user'}
              onChange={(e) => setFieldValue('userType',e?.target.value)}
              sx={{my:2}}
              >
              <FormControlLabel value={'user'} control={<Radio />} label="User" />
              <FormControlLabel value={'shelter'} control={<Radio />} label="Shelter" />
            </RadioGroup>
          </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography sx={{cursor:'pointer', color:'rgb(221, 132, 38)', textDecoration:'underline',textAlign:'center' }}
            onClick={() => navigate('/')}>Remember Your Password?</Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <Button type='submit' variant='contained' sx={{backgroundColor:'rgb(221, 132, 38)',display:'flex', justifyContent:'center',width:'100%'}}>
              Update Password
            </Button>
          </Grid>
          </Grid>
        </Form>)}
      </Formik>
    </Grid>
  )
}

export default ForgotPassword