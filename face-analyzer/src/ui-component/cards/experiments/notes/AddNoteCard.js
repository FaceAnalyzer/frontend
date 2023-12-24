import React from 'react';
import PropTypes from 'prop-types';

// assets
import {IconClipboardList} from '@tabler/icons';
import AddNoteModal from "../../../modals/experiments/notes/AddNoteModal";
import GenericAddCard from "../../GenericAddCard";

// ===========================|| ADD NOTE CARD ||=========================== //

const AddNoteCard = ({isLoading, experimentId}) => {
    const data = {
        name: "Add note",
        description: "Click to add a new note.",
        type: "note",
    }
    const modalProps = {experimentId};

    return (
        <GenericAddCard
            isLoading={isLoading}
            data={data}
            AddModal={AddNoteModal}
            iconComponent={<IconClipboardList/>}
            modalProps={modalProps}
        />
    );
};

AddNoteCard.propTypes = {
    isLoading: PropTypes.bool,
    experimentId: PropTypes.number
};

export default AddNoteCard;
