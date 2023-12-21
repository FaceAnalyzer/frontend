import React, {useState} from 'react';

import {styled, useTheme} from '@mui/material/styles';
import {Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Typography} from '@mui/material';
import MainCard from "../../cards/MainCard";
import * as Yup from "yup";
import {Formik} from "formik";
import useScriptRef from "../../../hooks/useScriptRef";
import AnimateButton from "../../extended/AnimateButton";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from "../ModalComponents";
import axios from "axios";
import {ADD_EXPERIMENT_API, DEFAULT_API_CONFIG} from "../../../endpoints/BackendEndpoints";
import {useNavigate} from "react-router-dom";
import {PulseLoader} from "react-spinners";

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: '#fff',
  borderColor: theme.palette.secondary.dark,
  borderWidth: '1rem',
  overflow: 'hidden',
  position: 'relative',
}));

// ===========================|| ADD EXPERIMENT MODAL ||=========================== //

const AddExperimentModal = ({showModal, closeModal, projectId}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const scriptedRef = useScriptRef();
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const handleSave = async (values, {setErrors, setStatus}) => {
    setLoadingSpinner(true);
    try {
      values.projectId = projectId;
      axios.post(ADD_EXPERIMENT_API, JSON.stringify(values), DEFAULT_API_CONFIG)
          .then(response => {
            setLoadingSpinner(false);
            // this.setState({articleId: response.data.id});
            if (response.status === 201) {
              // Refresh the page after a successful submission
              navigate(0);
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
    setLoadingSpinner(false);
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
                          Add experiment
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
                              type="text"
                              name="description"
                              onChange={handleChange}
                          />
                        </FormControl>

                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                              <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                  </ModalBody>
                  <ModalFooter>
                    {loadingSpinner && (
                        <div className={"loading-spinner"} style={{marginRight: "10px"}}>
                          <PulseLoader
                              color={theme.palette.secondary.dark}
                              size={15}
                              speedMultiplier={0.8}
                          />
                        </div>
                    )}
                    <AnimateButton>
                      <Button
                          id={"button-save"}
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
                          id={"button-close"}
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
