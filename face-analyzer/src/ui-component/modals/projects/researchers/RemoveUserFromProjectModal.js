import React from 'react';

import {styled, useTheme} from '@mui/material/styles';
import {Box, Button, FormHelperText, Grid, Typography} from '@mui/material';
import {Formik} from "formik";
import useScriptRef from "../../../../hooks/useScriptRef";
import MainCard from "../../../cards/MainCard";
import AnimateButton from "../../../extended/AnimateButton";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from "../../ModalComponents";
import {REMOVE_RESEARCHER_FROM_PROJECT_API} from "../../../../endpoints/BackendEndpoints";
import axios from "axios";

const CardWrapper = styled(MainCard)(({theme}) => ({
    backgroundColor: '#fff',
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
}));

// ===========================|| REMOVE USER FROM PROJECT MODAL ||=========================== //

const RemoveUserFromProjectModal = ({showModal, closeModal, userForRemoval, projectData}) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();

    const user = userForRemoval;
    const userId = user.id;
    const project = projectData;
    const projectId = project.id;

    const handleDelete = async (values, {setErrors, setStatus}) => {
        const items = {researchersIds: [userId]};
        try {
            await axios.put(REMOVE_RESEARCHER_FROM_PROJECT_API.replace('{id}', projectId), JSON.stringify(items))
                .then(response => {
                    if (response.status === 204) {
                        window.location.reload();
                    } else {
                        const data = response.data;
                        setErrors(data.errors);
                        setStatus({success: false});
                    }
                });

            console.log("Delete user:", userForRemoval);

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
                                id: {userId},
                            }}
                            onSubmit={async (values, {setErrors, setStatus}) => {
                                try {
                                    if (scriptedRef.current) {
                                        await handleDelete(values, {setErrors, setStatus});
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

                            {({errors, handleSubmit, isSubmitting}) => (
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
                                                        Remove user from project
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                            {errors.submit && (
                                                <Box sx={{mt: 3}}>
                                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                                </Box>
                                            )}

                                            <Typography variant="body2">
                                                Are you sure you want to remove
                                                user <strong>{`${user.name} ${user.surname} `}</strong>
                                                from project <strong>{project.name}</strong> ?
                                            </Typography>

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
                                                    Yes
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
                                                    Cancel
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

export default RemoveUserFromProjectModal;
