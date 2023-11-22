import React from 'react';

import {styled} from '@mui/material/styles';
import MainCard from "../../../cards/MainCard";

const CardWrapper = styled(MainCard)(({theme}) => ({
    backgroundColor: '#fff',
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
}));

// ===========================|| ADD USER TO PROJECT MODAL ||=========================== //

const AddUserToProjectModal = () => {
    return (
        // TODO: everything TM
        <CardWrapper/>
    );
};

export default AddUserToProjectModal;
