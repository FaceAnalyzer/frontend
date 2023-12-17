import React from 'react';

import {styled, useTheme} from '@mui/material/styles';
import {Box, Button, FormHelperText, Grid, Typography} from '@mui/material';
import MainCard from "../../cards/MainCard";
import {Formik} from "formik";
import useScriptRef from "../../../hooks/useScriptRef";
import AnimateButton from "../../extended/AnimateButton";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from "../ModalComponents";
import axios from "axios";
import {DEFAULT_API_CONFIG, DELETE_STIMULI_BY_ID_API} from "../../../endpoints/BackendEndpoints";
import {useLocation, useNavigate} from "react-router-dom";

const CardWrapper = styled(MainCard)(({theme}) => ({
    backgroundColor: '#fff',
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
}));

// ===========================|| DELETE STIMULI MODAL ||=========================== //

const DeleteStimuliModal = ({showModal, closeModal, data}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const scriptedRef = useScriptRef();
    const deleteId = data.id;

    const handleDelete = () => {
        try{
            axios.delete(DELETE_STIMULI_BY_ID_API.replace("{id}", deleteId), DEFAULT_API_CONFIG)
                .then(response => {
                    if (response.status === 204) {
                        if(location.pathname === `/experiment/${data.experimentId}`){
                            navigate(0);
                        }
                        else{
                            navigate('/experiment/${data.experimentId}');
                            navigate(0); //without this the sidebar list doesn't refresh, a better way probably exists
                        }
                    }
                    else{
                        const data = response.data;
                        console.error("resp:", response);
                        console.error("Error deleting stimulus:", data.errors);
                    }
                })
        } catch(e) {
            console.error("Error deleting stimulus:", e);
        }
    };


    return (
        <CardWrapper border={false} content={false}>
            {showModal && (
                <ModalOverlay>
                    <Modal>
                        <Formik
                            initialValues={{
                                id: {deleteId},
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
                                                        Delete stimulus
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                            {errors.submit && (
                                                <Box sx={{mt: 3}}>
                                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                                </Box>
                                            )}

                                            <Typography variant="body2">
                                                Are you sure you want to delete <strong>{data.name}</strong>?
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

export default DeleteStimuliModal;
