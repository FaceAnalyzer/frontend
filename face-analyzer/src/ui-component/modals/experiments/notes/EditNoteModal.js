import React, {useState} from 'react';

import {styled, useTheme} from '@mui/material/styles';
import {Box, Button, FormControl, FormHelperText, Grid, OutlinedInput, Typography} from '@mui/material';
import * as Yup from "yup";
import {Formik} from "formik";
import useScriptRef from "../../../../hooks/useScriptRef";
import MainCard from "../../../cards/MainCard";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from "../../ModalComponents";
import AnimateButton from "../../../extended/AnimateButton";
import {DEFAULT_API_CONFIG, EDIT_NOTE_API} from "../../../../endpoints/BackendEndpoints";
import axios from "axios";
import {useAuth} from "../../../../context/authContext";
import {useNavigate} from "react-router-dom";
import {PulseLoader} from "react-spinners";

const CardWrapper = styled(MainCard)(({theme}) => ({
    backgroundColor: '#fff',
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
}));

// ===========================|| EDIT NOTE MODAL ||=========================== //

const EditNoteModal = ({showModal, closeModal, note}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const noteId = note.id;
    const noteDescription = note.description;
    console.log("nd", note);
    const {user} = useAuth();
    const [loadingSpinner, setLoadingSpinner] = useState(false);

    const handleSave = async (values, {setErrors, setStatus}) => {
        setLoadingSpinner(true);
        try {
            values.creatorId = note.creatorId;
            values.experimentId = note.experimentId;
            if (note.creatorId !== user.id) {
                setErrors("Cannot edit the note you haven't created");
                setStatus({success: false});
                setLoadingSpinner(false);
                return;
            }
            axios.put(EDIT_NOTE_API.replace("{id}", noteId), JSON.stringify(values), DEFAULT_API_CONFIG)
                .then(response => {
                    setLoadingSpinner(false);
                    if (response.status === 200) {
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
        <CardWrapper border={false} content={false}>
            {showModal && (
                <ModalOverlay>
                    <Modal>
                        <Formik
                            initialValues={{
                                description: noteDescription,
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
                                                        Note
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
                                                    defaultValue={note.description}
                                                    disabled={user.id !== note.creatorId}
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
                                                    disabled={isSubmitting}
                                                    sx={{display: user.id === note.creatorId ? "" : "none"}}
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

export default EditNoteModal;
