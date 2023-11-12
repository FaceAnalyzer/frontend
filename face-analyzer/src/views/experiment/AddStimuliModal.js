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
import {ADD_STIMULI_API, DEFAULT_API_CONFIG} from "../projects/BackendEndpoints";

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: '#fff',
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
}));

// ===========================|| ADD STIMULI MODAL ||=========================== //

const AddStimuliModal = ({showModal, closeModal, experimentId}) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();

    const handleSave = async (values, {setErrors, setStatus}) => {
        try {
            axios.post(ADD_STIMULI_API, JSON.stringify(values), DEFAULT_API_CONFIG)
                    .then(response => {
                        if (response.status === 201) {
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
                                            description: '',
                                            link: '',
                                            experimentId: experimentId,
                                            submit: null
                                        }}
                                        validationSchema={Yup.object().shape({
                                            description: Yup.string().max(255),
                                            link: Yup.string().url().required('YouTube link is required')
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
                                                    Add stimulus
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <FormControl fullWidth error={Boolean(touched.link && errors.link)}
                                                     sx={{...theme.typography.customInput}}>
                                            <InputLabel htmlFor="stimulusLink">YouTube link</InputLabel>
                                                    <OutlinedInput
                                                        id="stimulusLink"
                                                        type="text"
                                                        name="link"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                            {touched.link && errors.link && (
                                                <FormHelperText error id="stimulusLinkHandler">
                                                    {errors.link}
                                            </FormHelperText>
                                            )}
                                        </FormControl>

                                        <FormControl fullWidth sx={{...theme.typography.customInput}}>
                                            <InputLabel htmlFor="stimulusDescription">Description</InputLabel>
                                            <OutlinedInput
                                                id="stimulusDescription"
                                                type="text"
                                                name="description"
                                                onChange={handleChange}
                                            />
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

export default AddStimuliModal;
