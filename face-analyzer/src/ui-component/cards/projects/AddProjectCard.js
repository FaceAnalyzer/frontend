import React from 'react';
import PropTypes from 'prop-types';

// assets
import AddProjectModal from "../../modals/projects/AddProjectModal";
import {FolderOpen} from "@mui/icons-material";
import GenericAddCard from "../GenericAddCard";

// ===========================|| ADD PROJECT CARD ||=========================== //

const AddProjectCard = ({isLoading}) => {
    const data = {
        name: "Add project",
        description: "Click to add a new project.",
        type: "project",
    };

    return (
        <GenericAddCard isLoading={isLoading} data={data} iconComponent={<FolderOpen/>} AddModal={AddProjectModal}/>
    );
};

AddProjectCard.propTypes = {
    isLoading: PropTypes.bool
};

export default AddProjectCard;
