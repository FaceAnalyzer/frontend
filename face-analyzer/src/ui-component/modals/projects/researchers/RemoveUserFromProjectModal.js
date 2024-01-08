import React, {useState} from 'react';

import {styled, useTheme} from '@mui/material/styles';
import {Box, Button, FormHelperText, Grid, Typography} from '@mui/material';
import {Formik} from "formik";
import useScriptRef from "../../../../hooks/useScriptRef";
import MainCard from "../../../cards/MainCard";
import AnimateButton from "../../../extended/AnimateButton";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from "../../ModalComponents";
import {REMOVE_RESEARCHER_FROM_PROJECT_API} from "../../../../endpoints/BackendEndpoints";
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

// ===========================|| REMOVE USER FROM PROJECT MODAL ||=========================== //

const RemoveUserFromProjectModal = ({showModal, closeModal, userForRemoval, projectData}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [disableSaveButton, setDisableSaveButton] = useState(false);

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
                        navigate(0);
                    } else {
                        const data = response.data;
                        setLoadingSpinner(false);
                        setDisableSaveButton(false);
                        setErrors(data.errors);
                        setStatus({success: false});
                    }
                });

            console.log("Delete user:", userForRemoval);

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
                                id: {userId},
                            }}
                            onSubmit={async (values, {setErrors, setStatus}) => {
                                setDisableSaveButton(true);
                                setLoadingSpinner(true);
                                try {
                                    if (scriptedRef.current) {
                                        await handleDelete(values, {setErrors, setStatus});
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

                            {({errors, handleSubmit}) => (
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
                                                    id={"button-yes"}
                                                    disableElevation
                                                    disabled={disableSaveButton}
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

RemoveUserFromProjectModal.propTypes = {
    showModal: PropTypes.bool,
    closeModal: PropTypes.func,
    userForRemoval: PropTypes.object,
    projectData: PropTypes.object
};

export default RemoveUserFromProjectModal;
