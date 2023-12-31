import PropTypes from 'prop-types';

// assets
import {IconFlask} from '@tabler/icons';
import {useNavigate} from "react-router-dom";
import DeleteExperimentModal from "../../modals/projects/DeleteExperimentModal";
import EditExperimentModal from "../../modals/projects/EditExperimentModal";
import GenericCard from "../GenericCard";

// ===========================|| EXPERIMENT CARD ||=========================== //

const ExperimentCard = ({isLoading, data}) => {
  const navigate = useNavigate();

  return (
      <GenericCard
          isLoading={isLoading}
          data={data}
          iconComponent={<IconFlask/>}
          DeleteModal={DeleteExperimentModal}
          EditModal={EditExperimentModal}
          openLink={(id) => navigate(`/experiment/${id}`)}
      />
  );
};

ExperimentCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.object,
};

export default ExperimentCard;
