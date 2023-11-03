import React from 'react';

import {styled, useTheme} from '@mui/material/styles';
import {Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Typography} from '@mui/material';
import MainCard from "../../ui-component/cards/MainCard";
import * as Yup from "yup";
import {Formik} from "formik";
import useScriptRef from "../../hooks/useScriptRef";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from "../projects/ModalComponents";
import axios from "axios";
import {ADD_VIDEO_API} from "../projects/BackendEndpoints";

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: '#fff',
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
}));

// ===========================|| ADD VIDEO MODAL ||=========================== //

const AddVideoModal = ({ showModal, closeModal }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();

    const handleSave = async (values, {setErrors, setStatus}) => {
        try {

            axios.post(ADD_VIDEO_API, JSON.stringify(values))
                    .then(response => {
                        this.setState({videoId: response.data.id});
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
                                        initialValues={{
                                            title: '',
                                            description: '',
                                            url: '',
                                            submit: null
                                        }}
                                        validationSchema={Yup.object().shape({
                                            title: Yup.string().max(255).required('Video title is required'),
                                            description: Yup.string().max(255),
                                            url: Yup.string().url().required('Video URL is required')
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
                                                    Add video
                                                </Typography>
                                            </Grid>
                                        </Grid>


                                                <FormControl fullWidth error={Boolean(touched.title && errors.title)} sx={{ ...theme.typography.customInput }}>
                                                    <InputLabel htmlFor="videoTitle">Title</InputLabel>
                                                    <OutlinedInput
                                                            id="videoTitle"
                                                            type="text"
                                                            name="title"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                    />
                                                {touched.title && errors.title && (
                                                    <FormHelperText error id="videoTitleHandler">
                                                {errors.title}
                                            </FormHelperText>
                                            )}
                                                </FormControl>

                                                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                                    <InputLabel htmlFor="videoDescription">Description</InputLabel>
                                                    <OutlinedInput
                                                            id="videoDescription"
                                                            type="name"
                                                            name="description"
                                                    />
                                                </FormControl>

                                                <FormControl fullWidth error={Boolean(touched.url && errors.url)} sx={{ ...theme.typography.customInput }}>
                                                    <InputLabel htmlFor="videoUrl">URL</InputLabel>
                                                    <OutlinedInput
                                                            id="videoUrl"
                                                            type="text"
                                                            name="url"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                    />
                                                {touched.url && errors.url && (
                                                    <FormHelperText error id="videoUrlHandler">
                                                {errors.url}
                                            </FormHelperText>
                                            )}
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

export default AddVideoModal;
