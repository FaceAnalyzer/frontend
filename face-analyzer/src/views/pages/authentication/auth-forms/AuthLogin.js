import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Stack, Typography, TextField, InputAdornment, IconButton, InputLabel, OutlinedInput } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { PING_API } from 'endpoints/BackendEndpoints'; // LOGIN_API
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from 'context/authContext';

// Logging out happens in "face-analyzer\src\layout\MainLayout\Header\ProfileSection\index.js"
// Line 58, in the function "handleLogout"

const AuthLogin = ({ ...others }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { setToken } = useAuth();


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const getPING = async () => {
    try {
      const response = await axios.get(PING_API);
      console.log('response', response);
      const token = response.data;
      console.log('token', token)
      return token;
    }
    catch (err) {
      console.error(err);
      return null;
    }
  }

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string('Cannot be empty').max(255).required('Email or username is required'),
        password: Yup.string().required('Password is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setSubmitting(true);
        try {
          // const response = await axios.post(LOGIN_API, {
          //   username: values.email,
          //   password: values.password});
          const ping = await getPING();
          console.log('ping', ping);
          setToken(ping);
          // const { token } = response.data;
          // console.log('token', token)
          // setToken(token);
          // setToken("this is for debugging purposes");
          // console.log('Login successful', token);
          navigate('/');
          setStatus({ success: true });
            // setStatus({ success: false });
            // setErrors({ submit: data.message });
          }
        catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: 'Did not log in' });
        }

        setSubmitting(false);
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
            <TextField
              id="email"
              name="email"
              label="Email Address / Username"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helpertext={touched.email && errors.email}
            />
          </FormControl>

          <Box mt={2}> {/* Add margin-top */}
            <FormControl fullWidth error={Boolean(touched.password && errors.password)}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helpertext={touched.password && errors.password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                inputprops={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size='large'
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
          </Box> {/* End of margin-top Box */}

          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <FormControlLabel
              control={<Checkbox checked={values.checked} onChange={handleChange} name="checked" color="primary" />}
              label="Remember me"
            />
            <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
              Forgot Password?
            </Typography>
          </Stack>

          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box mt={2}>
            <AnimateButton>
              <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                Sign in
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AuthLogin;
