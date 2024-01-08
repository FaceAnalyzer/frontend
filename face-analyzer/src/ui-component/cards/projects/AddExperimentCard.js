import React from 'react';
import PropTypes from 'prop-types';

// assets
import {IconFlask} from '@tabler/icons';
import AddExperimentModal from '../../modals/projects/AddExperimentModal';
import GenericAddCard from "../GenericAddCard";

// ===========================|| ADD EXPERIMENT CARD ||=========================== //

const AddExperimentCard = ({isLoading, projectId}) => {
  const data = {
    name: "Add experiment",
    description: "Click to add a new experiment.",
    type: "experiment",
  };
  const modalProps = {projectId};

  return (
    <GenericAddCard isLoading={isLoading} data={data} iconComponent={<IconFlask />} AddModal={AddExperimentModal} modalProps={modalProps}/>
  );
};

AddExperimentCard.propTypes = {
  isLoading: PropTypes.bool,
  projectId: PropTypes.number,
};

export default AddExperimentCard;
