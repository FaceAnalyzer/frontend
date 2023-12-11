import React from 'react';

import {styled, useTheme} from '@mui/material/styles';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    OutlinedInput,
    Typography
} from '@mui/material';
import * as Yup from "yup";
import {Formik} from "formik";
import {ADD_NOTE_API, DEFAULT_API_CONFIG} from "../../../../endpoints/BackendEndpoints";
import useScriptRef from "../../../../hooks/useScriptRef";
import axios from "axios";
import MainCard from "../../../cards/MainCard";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from "../../ModalComponents";
import AnimateButton from "../../../extended/AnimateButton";
import {useAuth} from "../../../../context/authContext";

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
    const scriptedRef = useScriptRef();
    const {user} = useAuth();

    const handleSave = async (values, {setErrors, setStatus}) => {
        try {
            console.log("user", user);
            values.experimentId = experimentId;
            values.creatorId = user.id;
            axios.post(ADD_NOTE_API, JSON.stringify(values), DEFAULT_API_CONFIG)
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
                                description: Yup.string().max(300).required('Description is required')
                            })}

                            onSubmit={async (values, {setErrors, setStatus}) => {
                                try {
                                    if (scriptedRef.current) {
                                        await handleSave(values, {setErrors, setStatus});
                                        setStatus({success: true});
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

export default AddNoteModal;
