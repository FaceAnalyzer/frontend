import React from 'react';
import PropTypes from 'prop-types';

// assets
import {IconVideo} from '@tabler/icons';
import AddStimuliModal from '../../modals/experiments/AddStimuliModal';
import GenericAddCard from "../GenericAddCard";

// ===========================|| ADD STIMULI CARD ||=========================== //

const AddStimuliCard = ({isLoading, experimentId}) => {
    const data = {
        name: "Add stimulus",
        description: "Click to add a new stimulus.",
        type: "note",
    }
    const modalProps = {experimentId}

    return (
        <GenericAddCard
            isLoading={isLoading}
            data={data}
            iconComponent={<IconVideo />}
            AddModal={AddStimuliModal}
            modalProps={modalProps}
        />
    );
};

AddStimuliCard.propTypes = {
    isLoading: PropTypes.bool,
    experimentId: PropTypes.number
};

export default AddStimuliCard;
