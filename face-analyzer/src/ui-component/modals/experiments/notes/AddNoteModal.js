import React, {useState} from 'react';

import {styled, useTheme} from '@mui/material/styles';
import {Box, Button, FormControl, FormHelperText, Grid, OutlinedInput, Typography} from '@mui/material';
import * as Yup from "yup";
import {Formik} from "formik";
import {ADD_NOTE_API, DEFAULT_API_CONFIG} from "../../../../endpoints/BackendEndpoints";
import useScriptRef from "../../../../hooks/useScriptRef";
import axios from "axios";
import MainCard from "../../../cards/MainCard";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from "../../ModalComponents";
import AnimateButton from "../../../extended/AnimateButton";
import {useAuth} from "../../../../context/authContext";
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

// ===========================|| ADD NOTE MODAL ||=========================== //

const AddNoteModal = ({showModal, closeModal, experimentId}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const {user} = useAuth();
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [disableSaveButton, setDisableSaveButton] = useState(false);

    const handleSave = async (values, {setErrors, setStatus}) => {
        try {
            values.experimentId = experimentId;
            values.creatorId = user.id;
            axios.post(ADD_NOTE_API, JSON.stringify(values), DEFAULT_API_CONFIG)
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
        <CardWrapper border={false} content={false}>
            {showModal && (
                <ModalOverlay>
                    <Modal>
                        <Formik
                            initialValues={{
                                description: '',
                                submit: null
                            }}
                            validationSchema={Yup.object().shape({
                                description: Yup.string().max(1000).required('Description is required')
                            })}

                            onSubmit={async (values, {setErrors, setStatus}) => {
                                setDisableSaveButton(true);
                                setLoadingSpinner(true);
                                try {
                                    if (scriptedRef.current) {
                                        await handleSave(values, {setErrors, setStatus});
                                        setStatus({success: true});
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
                                                        Add note
                                                    </Typography>
                                                </Grid>
                                            </Grid>


                                            <FormControl fullWidth
                                                         error={Boolean(touched.description && errors.description)}
                                                         sx={{...theme.typography.customInput}}>
                                                <OutlinedInput
                                                    id="noteDescription"
                                                    name="description"
                                                    rows={5}
                                                    multiline
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />

                                                {touched.description && errors.description && (
                                                    <FormHelperText error id="noteNameHandler" sx={{ml: 0}}>
                                                        {errors.description}
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

AddNoteModal.propTypes = {
    showModal: PropTypes.bool,
    closeModal: PropTypes.func,
    experimentId: PropTypes.number
};

export default AddNoteModal;
