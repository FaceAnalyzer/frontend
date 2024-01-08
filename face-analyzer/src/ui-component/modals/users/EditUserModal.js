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
import React, {useState} from "react";
import MainCard from "../../cards/MainCard";
import {PASSWORD_RESET_API, PUT_USER_BY_ID_API} from "../../../endpoints/BackendEndpoints";
import axios from "axios";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import {PulseLoader} from "react-spinners";

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: '#fff',
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2001,
}));

const EditUserModal = ({closeModal, showModal, userForEdit, existingEmails, existingUsernames}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [disableSaveButton, setDisableSaveButton] = useState(false);

    //const phoneRegExp = /^((\+[1-9]{1,4}[ -]*)|(\([0-9]{2,3}\)[ -]*)|([0-9]{2,4})[ -]*)*?[0-9]{3,4}?[ -]*[0-9]{3,4}?$/
    const phoneRegExp = /^[\d\s().\-+]+$/
    const passRegExp = /^.{8,}$/

    const user = userForEdit;

    const handleUpdate = async (values, {setErrors, setStatus}) => {
        try {
            axios.put(PUT_USER_BY_ID_API.replace("{id}", user.id), JSON.stringify(values))
                .then(response => {
                    if (response.status === 200) {
                        //window.location.reload();
                    } else {
                        const data = response.data;
                        setLoadingSpinner(false);
                        setDisableSaveButton(false);
                        setErrors(data.errors);
                        setStatus({success: false});
                    }
                }).catch(response => {
                    const data = response.data;
                    setLoadingSpinner(false);
                    setDisableSaveButton(false);
                    setErrors(data);
                    setStatus({success: false});
                });
        } catch (err) {
            console.error(err);
            setLoadingSpinner(false);
            setDisableSaveButton(false);
            setErrors({submit: err.message});
            setStatus({success: false});
        }

        if(values.password !== ''){
            const passwordResetValues = {
                userId: user.id,
                newPassword: values.password
            }

            try {
                axios.patch(PASSWORD_RESET_API, JSON.stringify(passwordResetValues))
                    .then(response => {
                        if (response.status === 200) {
                            //window.location.reload();
                        } else {
                            const data = response.data;
                            setLoadingSpinner(false);
                            setDisableSaveButton(false);
                            setErrors(data.errors);
                            setStatus({success: false});
                        }
                    }).catch(response => {
                    const data = response.data;
                    setLoadingSpinner(false);
                    setDisableSaveButton(false);
                    setErrors(data);
                    setStatus({success: false});
                });
            } catch (err) {
                console.error(err);
                setLoadingSpinner(false);
                setDisableSaveButton(false);
                setErrors({submit: err.message});
                setStatus({success: false});
            }
        }
        //Reload whether password is updated or not
        navigate(0);
    };

    return (
        <CardWrapper border={false} content={false} >
            {showModal && (
                <ModalOverlay>
                    <Modal lg>
                        <Formik
                            initialValues={{
                                name: user.name,
                                surname: user.surname,
                                username: user.username,
                                password: '',
                                email: user.email,
                                contactNumber: user.contactNumber,
                                role: user.role,
                                submit: null
                            }}
                            validationSchema={Yup.object().shape({
                                name: Yup.string().max(255).required('Name is required'),
                                surname: Yup.string().max(255).required('Surname is required'),
                                username: Yup.string().max(255)
                                    .required('Username is required')
                                    .test('UniqueUsername', 'Username already taken', async () => {
                                        return !(existingUsernames.includes(username.value) && username.value !== user.username);
                                    }),
                                password: Yup.string().trim()
                                    .matches(passRegExp, {
                                    message: 'Password is too short - use at least 8 characters',
                                    excludeEmptyString: true
                                    }),
                                email: Yup.string().email('Invalid email')
                                    .required('Email is required')
                                    .test('UniqueEmail', 'Email already taken', async () => {
                                        return !(existingEmails.includes(email.value) && email.value !== user.email);
                                    }),
                                contactNumber: Yup.string().matches(phoneRegExp, 'Invalid contact number').required('Contact number is required'),
                                role: Yup.string().required('Role is required')
                            })}

                            onSubmit={async (values, { setErrors, setStatus }) => {
                                setDisableSaveButton(true);
                                setLoadingSpinner(true);
                                try {
                                    if (scriptedRef.current) {
                                        await handleUpdate(values, {setErrors, setStatus});
                                        setStatus({ success: true });
                                    }
                                } catch (err) {
                                    console.error(err);
                                    setLoadingSpinner(false);
                                    setDisableSaveButton(false);
                                    if (scriptedRef.current) {
                                        setStatus({ success: false });
                                        setErrors({ submit: err.message });
                                    }
                                }
                            }}>

                            {({ errors, handleBlur, handleChange, handleSubmit, touched , values}) => (
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
                                                        Edit user
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
                                                    defaultValue={user.name}
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
                                                    defaultValue={user.surname}
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
                                                    defaultValue={user.username}
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
                                                    placeholder="Unchanged"
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
                                                    defaultValue={user.email}
                                                />
                                                {touched.email && errors.email && (
                                                    <FormHelperText error id="emailHandler">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>

                                            <FormControl fullWidth error={Boolean(touched.contactNumber && errors.contactNumber)} sx={{ ...theme.typography.customInput }}>
                                                <InputLabel htmlFor="contactNumber">Phone number</InputLabel>
                                                <OutlinedInput
                                                    id="contactNumber"
                                                    type="text"
                                                    name="contactNumber"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    defaultValue={user.contactNumber}
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
                                                    disabled={disableSaveButton}
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

EditUserModal.propTypes = {
    showModal: PropTypes.bool,
    closeModal: PropTypes.func,
    userForEdit: PropTypes.object,
    existingEmails: PropTypes.array,
    existingUsernames: PropTypes.array,
}

export default EditUserModal;