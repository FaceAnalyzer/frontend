import React, {useEffect, useState} from 'react'; // Add useEffect import
import {useNavigate} from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField
} from '@mui/material';
import * as Yup from 'yup';
import {Formik} from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import {LOGIN_API} from 'endpoints/BackendEndpoints'; // LOGIN_API
import axios from 'axios';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {useAuth} from 'context/authContext';
import {Navigate} from "react-router";

const AuthLogin = ({ ...others }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {user, setToken, setUser} = useAuth();

  const [redirectToHome, setRedirectToHome] = useState(false);

  useEffect(() => {
    if (redirectToHome) {
      navigate('/');
    }
  }, [navigate, redirectToHome]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const getLoginToken = async (username, password) => {
    try {
      const response = await axios.post(LOGIN_API, {
        username: username,
        password: password
      });
      //console.log('response', response);
      const items = response.data;
      const token = items.accessToken;
      const user = items.user
      //console.log('token', token)
      //console.log('user', userId)
      return {token, user};
    }
    catch (err) {
      console.error(err);
      return null;
    }
  }

  return user ? (<Navigate to="/" replace/>) : (
      <Formik
          initialValues={{
            username: '',
            password: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string('Cannot be empty').max(255).required('Username is required'),
            password: Yup.string().required('Password is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            setSubmitting(true);
            try {
              const { token, user } = await getLoginToken(values.username, values.password);
              setToken(token);
              setUser(user);
              setRedirectToHome(true);
              setStatus({ success: true });
            }
            catch (err) {
              setStatus({ success: false });
              setErrors({submit: 'Username or password incorrect.'});
            }

            setSubmitting(false);
          }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              <FormControl fullWidth error={Boolean(touched.username && errors.username)}>
                <TextField
                    id="username"
                    name="username"
                    label="Username"
                    autoFocus
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && Boolean(errors.username)}
                    helpertext={touched.username && errors.username}
                />
              </FormControl>

              <Box mt={2}>
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
              </Box>

              {errors.submit && (
                  <Box mt={3}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Box>
              )}

              <Box mt={2}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                    Log in
                  </Button>
                </AnimateButton>
              </Box>
            </form>
        )}
      </Formik>
  );
};

export default AuthLogin;
