import PropTypes from 'prop-types';

// project imports
import {FolderOpen} from "@mui/icons-material";
import EditProjectModal from "../../modals/projects/EditProjectModal";
import DeleteProjectModal from "../../modals/projects/DeleteProjectModal";

// assets
import {useNavigate} from "react-router-dom";
import GenericCard from "../GenericCard";

// ===========================|| PROJECT CARD ||=========================== //

const ProjectCard = ({isLoading, data}) => {
    const navigate = useNavigate();
    const projectData = data;
    projectData["description"] = "Find all your project items here.";
    projectData["type"] = "project";

    return (
        <GenericCard
            isLoading={isLoading}
            data={projectData}
            iconComponent={<FolderOpen/>}
            DeleteModal={DeleteProjectModal}
            EditModal={EditProjectModal}
            openLink={(id) => navigate(`/project/${id}`)}
        />
    );
};

ProjectCard.propTypes = {
    isLoading: PropTypes.bool,
    data: PropTypes.object,
};

export default ProjectCard; 
