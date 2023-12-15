import React from 'react';

import {styled, useTheme} from '@mui/material/styles';
import {Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Typography} from '@mui/material';
import MainCard from "../../cards/MainCard";
import * as Yup from "yup";
import {Formik} from "formik";
import useScriptRef from "../../../hooks/useScriptRef";
import AnimateButton from "../../extended/AnimateButton";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from "../ModalComponents";
import axios from "axios";
import {DEFAULT_API_CONFIG, EDIT_EXPERIMENT_API} from "../../../endpoints/BackendEndpoints";

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: '#fff',
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
}));

// ===========================|| EDIT EXPERIMENT MODAL ||=========================== //

const EditExperimentModal = ({showModal, closeModal, initialValues}) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const experimentId = initialValues.id;
    const experiment = {
        name: initialValues.name,
        description: initialValues.description,
        projectId: initialValues.projectId
    };

    const handleUpdate = async (values, {setErrors, setStatus}) => {
        try {
            console.log(JSON.stringify(values));
            axios.put(EDIT_EXPERIMENT_API + '/' + experimentId, JSON.stringify(values), DEFAULT_API_CONFIG)
                    .then(response => {
                        if (response.status === 200) {
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
        } finally {
            // setSubmitting(false);
        }
    };


    return (
            <CardWrapper border={false} content={false} >
                {showModal && (
                        <ModalOverlay>
                            <Modal>
                                <Formik
                                    initialValues={experiment}
                                        validationSchema={Yup.object().shape({
                                            name: Yup.string().max(255).required('Experiment name is required'),
                                            description: Yup.string().max(255)
                                        })}

                                        onSubmit={async (values, { setErrors, setStatus }) => {
                                            try {
                                                if (scriptedRef.current) {
                                                    await handleUpdate(values, {setErrors, setStatus});
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
                                                    Edit experiment
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
                                                            defaultValue={experiment.name}
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
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            defaultValue={experiment.description}
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
                                                id={"button-update"}
                                                    disableElevation
                                                    disabled={isSubmitting}
                                                    fullWidth
                                                    size="medium"
                                                    type="submit"
                                                    variant="contained"
                                                    color="secondary">
                                                Update
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

export default EditExperimentModal;
