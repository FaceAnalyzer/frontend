import React from 'react';

import {styled, useTheme} from '@mui/material/styles';
import {Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Typography} from '@mui/material';
import MainCard from "../../cards/MainCard";
import * as Yup from "yup";
import {Formik} from "formik";
import useScriptRef from "../../../hooks/useScriptRef";
import AnimateButton from "../../extended/AnimateButton";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from "../ModalComponents";
import {DEFAULT_API_CONFIG, EDIT_PROJECT_API} from "../../../endpoints/BackendEndpoints";
import axios from "axios";

const CardWrapper = styled(MainCard)(({theme}) => ({
    backgroundColor: '#fff',
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
}));

// ===========================|| EDIT PROJECT MODAL ||=========================== //

const EditProjectModal = ({showModal, closeModal, initialValues}) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const projectId = initialValues.id;
    const project = {
        name: initialValues.name
    };

    const handleUpdate = async (values, {setErrors, setStatus}) => {
        try {
            console.log(JSON.stringify(values));
            console.log(projectId);
            axios.put(EDIT_PROJECT_API.replace("{id}", projectId), JSON.stringify(values), DEFAULT_API_CONFIG)
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
        <CardWrapper border={false} content={false}>
            {showModal && (
                <ModalOverlay>
                    <Modal>
                        <Formik
                            initialValues={project}
                            validationSchema={Yup.object().shape({
                                name: Yup.string().max(255).required('Project name is required'),
                            })}

                            onSubmit={async (values, {setErrors, setStatus}) => {
                                try {
                                    if (scriptedRef.current) {
                                        await handleUpdate(values, {setErrors, setStatus});
                                        // setStatus({ success: true });
                                    }
                                } catch (err) {
                                    console.error(err);
                                    if (scriptedRef.current) {
                                        setStatus({success: false});
                                        setErrors({submit: err.message});
                                    }
                                }
                            }}>

                            {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched}) => (
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
                                                        Edit project
                                                    </Typography>
                                                </Grid>
                                            </Grid>


                                            <FormControl fullWidth error={Boolean(touched.name && errors.name)}
                                                         sx={{...theme.typography.customInput}}>
                                                <InputLabel htmlFor="projectName">Name</InputLabel>
                                                <OutlinedInput
                                                    id="projectName"
                                                    type="text"
                                                    name="name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    defaultValue={project.name}
                                                />
                                                {touched.name && errors.name && (
                                                    <FormHelperText error id="projectNameHandler">
                                                        {errors.name}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>

                                            {errors.submit && (
                                                <Box sx={{mt: 3}}>
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
                                                    Update
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

export default EditProjectModal;
