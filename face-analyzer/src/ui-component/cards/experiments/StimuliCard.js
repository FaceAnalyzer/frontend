import PropTypes from 'prop-types';

// project imports
import {IconVideo} from "@tabler/icons";
import DeleteStimuliModal from "../../modals/experiments/DeleteStimuliModal";

// assets
import {useNavigate} from "react-router-dom";
import GenericCard from "../GenericCard";

// ===========================|| STIMULI CARD ||=========================== //

const StimuliCard = ({isLoading, data}) => {
    const navigate = useNavigate();
    const stimulusData = data;
    stimulusData["type"] = "stimulus";

    return (
        <GenericCard
            isLoading={isLoading}
            data={stimulusData}
            DeleteModal={DeleteStimuliModal}
            iconComponent={<IconVideo />}
            openLink={(id) => navigate(`/stimuli/${id}`)}
        />
    );
};

StimuliCard.propTypes = {
    isLoading: PropTypes.bool,
    data: PropTypes.object,
};

export default StimuliCard;
