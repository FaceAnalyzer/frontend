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
    Select,
    Typography
} from "@mui/material";
import AnimateButton from "../../extended/AnimateButton";
import React from "react";
import MainCard from "../../cards/MainCard";
import {ADD_USERS_API} from "../../../endpoints/BackendEndpoints";
import axios from "axios";
import PropTypes from "prop-types";

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: '#fff',
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2001,
}));

const AddUserModal = ({showModal, closeModal, existingEmails, existingUsernames}) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const phoneRegExp = /^((\+[1-9]{1,4}[ -]*)|(\([0-9]{2,3}\)[ -]*)|([0-9]{2,4})[ -]*)*?[0-9]{3,4}?[ -]*[0-9]{3,4}?$/

    const handleSave = async (values, {setErrors, setStatus}) => {
        try {
            axios.post(ADD_USERS_API, JSON.stringify(values))
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
                                contactNumber: '',
                                role: '',
                                submit: null
                            }}
                            validationSchema={Yup.object().shape({
                                name: Yup.string().max(255).required('Name is required'),
                                surname: Yup.string().max(255).required('Surname is required'),
                                username: Yup.string().max(255)
                                    .required('Username is required')
                                    .test('UniqueUsername', 'Username already taken', async () => {
                                        return !existingUsernames.includes(username.value);
                                    }),
                                password: Yup.string().min(8, 'Password is too short - use at least 8 characters')
                                    .required('Password is required'),
                                email: Yup.string().email('Invalid email')
                                    .required('Email is required')
                                    .test('UniqueEmail', 'Email already taken', async () => {
                                        return !existingEmails.includes(email.value);
                                    }),
                                contactNumber: Yup.string().matches(phoneRegExp, 'Invalid contact number').required('Contact number is required'),
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

                            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched , values}) => (
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
                                                    <FormHelperText error id="passwordHandler">
                                                        {errors.password}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>

                                            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                                                <InputLabel htmlFor="email">Email</InputLabel>
                                                <OutlinedInput
                                                    id="email"
                                                    type="text"
                                                    name="email"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                {touched.email && errors.email && (
                                                    <FormHelperText error id="emailHandler">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>

                                            <FormControl fullWidth error={Boolean(touched.contactNumber && errors.contactNumber)} sx={{ ...theme.typography.customInput }}>
                                                <InputLabel htmlFor="contactNumber">Contact</InputLabel>
                                                <OutlinedInput
                                                    id="contactNumber"
                                                    type="text"
                                                    name="contactNumber"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                {touched.contactNumber && errors.contactNumber && (
                                                    <FormHelperText error id="contactNumberHandler">
                                                        {errors.contactNumber}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>

                                            <FormControl fullWidth error={Boolean(touched.role && errors.role)} sx={{ ...theme.typography.customInput }}>
                                                <Select
                                                    native
                                                    value={values.role || ''}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    inputProps={{
                                                        name: 'role',
                                                        id: 'role',
                                                    }}
                                                >
                                                    <option value={""} disabled>Select Role</option>
                                                    <option value={"Admin"}>Admin</option>
                                                    <option value={"Researcher"}>Researcher</option>
                                                </Select>
                                                {touched.role && errors.role && (
                                                    <FormHelperText error id="roleHandler">
                                                        {errors.role}
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

AddUserModal.propTypes = {
    showModal: PropTypes.bool,
    closeModal: PropTypes.func,
    existingEmails: PropTypes.array,
    existingUsernames: PropTypes.array
}

export default AddUserModal;