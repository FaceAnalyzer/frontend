import React from 'react';
import {styled, useTheme} from '@mui/material/styles';
import {Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Typography} from '@mui/material';
import MainCard from "../../ui-component/cards/MainCard";
import * as Yup from "yup";
import {Formik} from "formik";
import useScriptRef from "../../hooks/useScriptRef";
import AnimateButton from "../../ui-component/extended/AnimateButton";

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: '#fff',
  borderColor: theme.palette.secondary.dark,
  borderWidth: '1rem',
  overflow: 'hidden',
  position: 'relative',
}));

const ModalOverlay = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000, /* Ensure it's on top of other content */
});

const Modal = styled('div')({
  background: '#fff',
  borderRadius: '1rem',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  maxWidth: {
    xs: 400,
    lg: 475,
  },
  margin: {
    xs: 2.5,
    md: 3,
  },
  '& > *': {
    flexGrow: 1,
    flexBasis: '50%',
  },
});

const ModalContent = styled('div')({
  padding: '20px',
});

// const ModalHeader = styled('div')({
//   display: 'flex',
//   justifyContent: 'space between',
//   alignItems: 'center',
//   borderBottom: '1px solid #ccc',
//   padding: '10px 20px',
// });

const ModalBody = styled('div')({
  padding: '20px',
});

const ModalFooter = styled('div')({
  borderTop: '1px solid #ccc',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '10px 20px',
});

// ===========================|| ADD EXPERIMENT MODAL ||=========================== //

const AddExperimentModal = ({ showModal, closeModal }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();

  // const submitNewExperiment = () => {
  // };

  return (
      <CardWrapper border={false} content={false} >
        {showModal && (
            <ModalOverlay>
              <Modal>
                <Formik
                    initialValues={{
                      name: '',
                      description: '',
                      submit: null
                    }}
                    validationSchema={Yup.object().shape({
                      name: Yup.string().max(255).required('Experiment name is required'),
                      description: Yup.string().max(255)
                    })}

                    onSubmit={async (values, { setErrors, setStatus }) => {
                      try {
                        if (scriptedRef.current) {
                          setStatus({ success: true });
                        }
                      } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                          setStatus({ success: false });
                          setErrors({ submit: err.message });
                        }
                      }
                    }}>

                  {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
                      <form noValidate onSubmit={handleSubmit}>
                <ModalContent>
                  <ModalBody>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography sx={{
                          fontSize: '2.125rem',
                          fontWeight: 500,
                          color: theme.palette.secondary.dark,
                          mb: 1
                        }}>
                          Create experiment
                        </Typography>
                      </Grid>
                    </Grid>


                        <FormControl fullWidth error={Boolean(touched.name && errors.name)} sx={{ ...theme.typography.customInput }}>
                          <InputLabel htmlFor="experimentName">Name</InputLabel>
                          <OutlinedInput
                              id="experimentName"
                              type="text"
                              name="name"
                              onBlur={handleBlur}
                              onChange={handleChange}
                          />
                        {touched.name && errors.name && (
                          <FormHelperText error id="experimentNameHandler">
                        {errors.name}
                      </FormHelperText>
                      )}
                        </FormControl>

                        <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                          <InputLabel htmlFor="experimentDescription">Description</InputLabel>
                          <OutlinedInput
                              id="experimentDescription"
                              type="name"
                              name="description"
                          />
                        </FormControl>

                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                              <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                  </ModalBody>
                  <ModalFooter>
                    <AnimateButton>
                      <Button disableElevation disabled={isSubmitting} fullWidth size="medium" type="submit" variant="contained" color="secondary">
                        Save
                      </Button>
                    </AnimateButton>
                    <AnimateButton>
                      <Button
                          variant="outlined"
                          fullWidth
                          onClick={closeModal}
                          size="medium"
                          sx={{
                            color: 'grey.700',
                            backgroundColor: theme.palette.grey[50],
                            borderColor: theme.palette.grey[100]
                          }}
                      >
                        Close
                      </Button>
                    </AnimateButton>
                  </ModalFooter>
                </ModalContent>
              </form>
              )}

            </Formik>
              </Modal>
            </ModalOverlay>
        )}
      </CardWrapper>
  );
};

export default AddExperimentModal;
