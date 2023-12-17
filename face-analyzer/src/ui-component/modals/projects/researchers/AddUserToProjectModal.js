import React from 'react';

import {styled, useTheme} from '@mui/material/styles';
import MainCard from "../../../cards/MainCard";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from "../../ModalComponents";
import {Formik} from "formik";
import * as Yup from "yup";
import {Box, Button, FormControl, FormHelperText, Grid, Select, Typography} from "@mui/material";
import AnimateButton from "../../../extended/AnimateButton";
import axios from "axios";
import {ADD_RESEARCHER_TO_PROJECT_API} from "../../../../endpoints/BackendEndpoints";
import useScriptRef from "../../../../hooks/useScriptRef";
import {useNavigate} from "react-router-dom";

const CardWrapper = styled(MainCard)(({theme}) => ({
    backgroundColor: '#fff',
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
}));

// ===========================|| ADD USER TO PROJECT MODAL ||=========================== //

const AddUserToProjectModal = ({showModal, closeModal, usersNotOnProjectData, projectData}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();

    const project = projectData;

    const handleSave = (values, {setErrors, setStatus}) => {
        const items = {researchersIds: [values.researcherId]};
        try {
            axios.put(ADD_RESEARCHER_TO_PROJECT_API.replace('{id}', project.id), JSON.stringify(items))
                .then(response => {
                    if (response.status === 204) {
                        navigate(0);
                    } else {
                        const data = response.data;
                        setErrors(data.errors);
                        setStatus({success: false});
                    }
                }).catch(response => {
                const data = response.data;
                setErrors(data);
                setStatus({success: false});
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
                                researcherId: '',
                                submit: null
                            }}
                            validationSchema={Yup.object().shape({
                                researcherId: Yup.string().required('Researcher is required')
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

                            {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
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
                                                        Add researcher
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                            <FormControl fullWidth
                                                         error={Boolean(touched.researcherId && errors.researcherId)}
                                                         sx={{...theme.typography.customInput}}>
                                                <Select
                                                    native
                                                    value={values.researcherId || ''}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    inputProps={{
                                                        name: 'researcherId',
                                                        id: 'researcherId',
                                                    }}
                                                >
                                                    <option value={""} disabled>Select researcher</option>

                                                    {usersNotOnProjectData.map((user) => (
                                                        <option key={user.id} value={user.id}>
                                                            {`${user.name} ${user.surname}`}
                                                        </option>
                                                    ))}
                                                </Select>
                                                {touched.researcherId && errors.researcherId && (
                                                    <FormHelperText error id="researcherIdHandler">
                                                        {errors.researcherId}
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
};

export default AddUserToProjectModal;
