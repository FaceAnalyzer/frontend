import React, {useState} from 'react';

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
import {useNavigate} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import PropTypes from "prop-types";

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
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [disableSaveButton, setDisableSaveButton] = useState(false);

    const projectId = initialValues.id;
    const project = {
        name: initialValues.name
    };

    const handleUpdate = async (values, {setErrors, setStatus}) => {
        try {
            axios.put(EDIT_PROJECT_API.replace("{id}", projectId), JSON.stringify(values), DEFAULT_API_CONFIG)
                .then(response => {
                    if (response.status === 200) {
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
                                setDisableSaveButton(true);
                                setLoadingSpinner(true);
                                try {
                                    if (scriptedRef.current) {
                                        await handleUpdate(values, {setErrors, setStatus});
                                        // setStatus({ success: true });
                                    }
                                } catch (err) {
                                    console.error(err);
                                    setLoadingSpinner(false);
                                    setDisableSaveButton(false);
                                    if (scriptedRef.current) {
                                        setStatus({success: false});
                                        setErrors({submit: err.message});
                                    }
                                }
                            }}>

                            {({errors, handleBlur, handleChange, handleSubmit, touched}) => (
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
                                                    id={"button-update"}
                                                    disableElevation
                                                    disabled={disableSaveButton}
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

EditProjectModal.propTypes = {
    showModal: PropTypes.bool,
    closeModal: PropTypes.func,
    initialValues: PropTypes.object
};

export default EditProjectModal;
