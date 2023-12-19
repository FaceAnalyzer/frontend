import {styled, useTheme} from "@mui/material/styles";
import useScriptRef from "../../../hooks/useScriptRef";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from "../ModalComponents";
import {Formik} from "formik";
import * as Yup from "yup";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Typography
} from "@mui/material";
import AnimateButton from "../../extended/AnimateButton";
import React from "react";
import MainCard from "../../cards/MainCard";
import PropTypes from "prop-types";
import {saveNewReaction} from "../../../views/reactions/AnalysisDataFunctions";
import {useNavigate} from "react-router-dom";

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: '#fff',
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2001,
}));

const SaveReactionModal = ({showModal, closeModal, stimuliId}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();

    const handleSave = async (values, {setErrors, setStatus}) => {
        saveNewReaction(stimuliId, values).then(() => {
            navigate(0);
        }).catch(result => {
            const data = result.data;
            setErrors(data);
            setStatus({success: false});
        });
    };

    return (
        <CardWrapper border={false} content={false} >
            {showModal && (
                <ModalOverlay>
                    <Modal lg>
                        <Formik
                            initialValues={{
                                name: '',
                                surname: '',
                            }}
                            validationSchema={Yup.object().shape({
                                name: Yup.string().max(255).required('Name is required'),
                                surname: Yup.string().max(255).required('Surname is required')
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

                            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched /*, values*/}) => (
                                <form noValidate onSubmit={handleSubmit}>
                                    <ModalContent>
                                        <ModalBody>
                                            <Grid container alignItems="center">
                                                <Grid item>
                                                    <Typography sx={{
                                                        fontSize: '2.125rem',
                                                        fontWeight: 500,
                                                        color: theme.palette.secondary.dark,
                                                    }}>
                                                        Save Reaction to Stimuli
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '1.075rem',
                                                            color: theme.palette.grey[500],
                                                            mb: 1
                                                        }}
                                                    >
                                                        Enter Participant Name and Surname
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                            <FormControl fullWidth error={Boolean(touched.name && errors.name)} sx={{ ...theme.typography.customInput }}>
                                                <InputLabel htmlFor="name">Name</InputLabel>
                                                <OutlinedInput
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                {touched.name && errors.name && (
                                                    <FormHelperText error id="nameHandler">
                                                        {errors.name}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>

                                            <FormControl fullWidth error={Boolean(touched.surname && errors.surname)} sx={{ ...theme.typography.customInput }}>
                                                <InputLabel htmlFor="surname">Surname</InputLabel>
                                                <OutlinedInput
                                                    id="surname"
                                                    type="text"
                                                    name="surname"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                {touched.surname && errors.surname && (
                                                    <FormHelperText error id="surnameHandler">
                                                        {errors.surname}
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
}

SaveReactionModal.propTypes = {
    showModal: PropTypes.bool,
    closeModal: PropTypes.func,
    stimuliId: PropTypes.number
}

export default SaveReactionModal;