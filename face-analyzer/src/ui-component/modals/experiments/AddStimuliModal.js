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
import {ADD_STIMULI_API, DEFAULT_API_CONFIG} from "../../../endpoints/BackendEndpoints";
import {useNavigate} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import PropTypes from "prop-types";

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
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [disableSaveButton, setDisableSaveButton] = useState(false);

    const handleSave = async (values, {setErrors, setStatus}) => {
        try {
            axios.post(ADD_STIMULI_API, JSON.stringify(values), DEFAULT_API_CONFIG)
                    .then(response => {
                        if (response.status === 201) {
                            navigate(0);
                        } else {
                            const data = response.data;
                            setLoadingSpinner(false);
                            setDisableSaveButton(false);
                            setErrors(data.errors);
                            setStatus({success: false});
                        }
                    });

        } catch (err) {
            console.error(err);
            setLoadingSpinner(false);
            setDisableSaveButton(false);
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
                                            link: '',
                                            experimentId: experimentId,
                                            submit: null
                                        }}
                                        validationSchema={Yup.object().shape({
                                            name: Yup.string().max(255).required('Name is required'),
                                            description: Yup.string().max(255),
                                            link: Yup.string().url().required('YouTube link is required')
                                        })}

                                        onSubmit={async (values, { setErrors, setStatus }) => {
                                            setDisableSaveButton(true);
                                            setLoadingSpinner(true);
                                            try {
                                                if (scriptedRef.current) {
                                                    await handleSave(values, {setErrors, setStatus});
                                                    // setStatus({ success: true });
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                setLoadingSpinner(false);
                                                setDisableSaveButton(false);
                                                if (scriptedRef.current) {
                                                    setStatus({ success: false });
                                                    setErrors({ submit: err.message });
                                                }
                                            }
                                        }}>

                                    {({ errors, handleBlur, handleChange, handleSubmit, touched }) => (
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

                                        <FormControl fullWidth error={Boolean(touched.name && errors.name)}
                                                     sx={{...theme.typography.customInput}}>
                                            <InputLabel htmlFor="stimulusName">Name</InputLabel>
                                            <OutlinedInput
                                                id="stimulusName"
                                                type="text"
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                            {touched.name && errors.name && (
                                                <FormHelperText error id="stimulusNameHandler">
                                                    {errors.name}
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

                                        {errors.submit && (
                                            <Box sx={{mt: 3}}>
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
                                                disabled={disableSaveButton}
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

AddStimuliModal.propTypes = {
    showModal: PropTypes.bool,
    closeModal: PropTypes.func,
    experimentId: PropTypes.number
};

export default AddStimuliModal;
