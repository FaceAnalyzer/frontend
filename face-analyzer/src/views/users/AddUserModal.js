import {styled, useTheme} from "@mui/material/styles";
import useScriptRef from "../../hooks/useScriptRef";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay} from "../projects/ModalComponents";
import {Formik} from "formik";
import * as Yup from "yup";
import {Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Typography} from "@mui/material";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import React from "react";
import MainCard from "../../ui-component/cards/MainCard";

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: '#fff',
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2001,
}));

const AddUserModal = ({showModal, closeModal}) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();

    const handleSave = async (values, {setErrors, setStatus}) => {
        try {
            /*
            axios.post(ADD_USER_API, JSON.stringify(values), DEFAULT_API_CONFIG)
                .then(response => {
                    // this.setState({articleId: response.data.id});
                    if (response.status === 201) {
                        // Refresh the page after a successful submission
                        window.location.reload();
                    } else {
                        const data = response.data;
                        setErrors(data.errors);
                        setStatus({success: false});
                    }
                });

             */

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
                    <Modal lg>
                        <Formik
                            initialValues={{
                                name: '',
                                surname: '',
                                username: '',
                                password: '',
                                email: '',
                                contact: '',
                                role: '',
                                submit: null
                            }}
                            validationSchema={Yup.object().shape({
                                name: Yup.string().max(255).required('Name is required'),
                                surname: Yup.string().max(255).required('Surname is required'),

                                username: Yup.string().max(255).required('Username is required'),
                                password: Yup.string().min(8, 'Password is too short - use at least 8 characters')
                                    .required('Password is required'),

                                email: Yup.string().email('Invalid email').required('Email is required'),
                                contact: Yup.string().max(32),
                                role: Yup.string().required('Role is required')
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

                            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
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
                                                        Add new user
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

                                            <FormControl fullWidth error={Boolean(touched.username && errors.username)} sx={{ ...theme.typography.customInput }}>
                                                <InputLabel htmlFor="username">Username</InputLabel>
                                                <OutlinedInput
                                                    id="username"
                                                    type="text"
                                                    name="username"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                {touched.username && errors.username && (
                                                    <FormHelperText error id="usernameHandler">
                                                        {errors.username}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>

                                            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                                                <InputLabel htmlFor="password">Password</InputLabel>
                                                <OutlinedInput
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                {touched.password && errors.password && (
                                                    <FormHelperText error id="usernameHandler">
                                                        {errors.password}
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
}

export default AddUserModal;