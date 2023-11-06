import React from 'react';

import {styled, useTheme} from '@mui/material/styles';
import {Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Typography} from '@mui/material';
import MainCard from "../../ui-component/cards/MainCard";
import * as Yup from "yup";
import {Formik} from "formik";
import useScriptRef from "../../hooks/useScriptRef";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from "./ModalComponents";
import axios from "axios";
import {ADD_EXPERIMENT_API} from "./BackendEndpoints";

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: '#fff',
  borderColor: theme.palette.secondary.dark,
  borderWidth: '1rem',
  overflow: 'hidden',
  position: 'relative',
}));

// ===========================|| ADD EXPERIMENT MODAL ||=========================== //

const AddExperimentModal = ({ showModal, closeModal }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();

  const handleSave = async (values, {setErrors, setStatus}) => {
      values={"name": "naziv","description": "opis", "projectId": 0};
    try {
        console.log(ADD_EXPERIMENT_API)
      axios.post(ADD_EXPERIMENT_API, JSON.stringify(values), {headers: {"accept": "text/plain", "Content-Type": "application/json"}})
          .then(response => {
            this.setState({articleId: response.data.id});
            if (response.status === 200) {
              // Refresh the page after a successful submission
              window.location.reload();
            } else {
              const data = response.data;
              setErrors(data.errors);
              setStatus({success: false});
            }
          });

    } catch (err) {
      console.error(err);
      setErrors({submit: err.message});
      setStatus({success: false});
    }
  };


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
                          await handleSave(values, {setErrors, setStatus});
                          // setStatus({ success: true });
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
                      <Button
                          disableElevation
                          disabled={isSubmitting}
                          fullWidth
                          size="medium"
                          type="submit"
                          variant="contained"
                          color="secondary">
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
