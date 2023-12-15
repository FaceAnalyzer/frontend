import React from 'react';

import {styled, useTheme} from '@mui/material/styles';
import {Box, Button, FormHelperText, Grid, Typography} from '@mui/material';
import MainCard from "../../cards/MainCard";
import {Formik} from "formik";
import useScriptRef from "../../../hooks/useScriptRef";
import AnimateButton from "../../extended/AnimateButton";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from "../ModalComponents";
import axios from "axios";
import {DELETE_USER_BY_ID_API} from "../../../endpoints/BackendEndpoints";

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: '#fff',
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
}));

// ===========================|| DELETE MODAL ||=========================== //

const DeleteUserModal = ({showModal, closeModal, userForDeletion}) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const deleteId = userForDeletion.id;
    const deleteUsername = userForDeletion.username;

    const handleDelete = async (values, {setErrors, setStatus}) => {
        try {
            await axios.delete(DELETE_USER_BY_ID_API.replace('{id}', deleteId))
                .then(response => {
                    // this.setState({articleId: response.data.id});
                    console.log(response.status)
                    if (response.status === 204) {
                        // Redirect to users page
                        window.location.href = '/users';
                    } else {
                        const data = response.data;
                        setErrors(data.errors);
                        setStatus({success: false});
                    }
                });

            console.log("Delete user:", userForDeletion);

        } catch (err) {
            console.error(err);
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
                                id: {deleteId},
                            }}
                            onSubmit={async (values, { setErrors, setStatus }) => {
                                try {
                                    if (scriptedRef.current) {
                                        await handleDelete(values, {setErrors, setStatus});
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

                            {({ errors, handleSubmit, isSubmitting }) => (
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
                                                        Delete user
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                            {errors.submit && (
                                                <Box sx={{ mt: 3 }}>
                                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                                </Box>
                                            )}

                                            <Typography variant="body2">
                                                Are you sure you want to delete user <strong>{deleteUsername}</strong>?
                                                This will also delete <strong>all</strong> of their data!
                                                This action is irreversible!
                                            </Typography>

                                        </ModalBody>
                                        <ModalFooter>
                                            <AnimateButton>
                                                <Button
                                                    id={"button-yes"}
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
                                                    id={"button-cancel"}
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

export default DeleteUserModal;
