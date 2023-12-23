import React, {useState} from 'react';
import {useTheme} from "@mui/material/styles";
import {Box, Button, Card, CardHeader, Link, Typography, useMediaQuery} from "@mui/material";
import AnimateButton from "../extended/AnimateButton";
import {IconChevronRight, IconFlask, IconTrashOff, IconVideo} from "@tabler/icons";
import PropTypes from "prop-types";
import DeleteStimuliModal from "../modals/experiments/DeleteStimuliModal";
import {FolderOpen} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

// ===========================|| STIMULI HEADER ||=========================== //

const StimuliHeader = ({stimulus, experimentData, projectData}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [showModal, setShowModal] = useState(false);

    const experiment = experimentData;
    const experimentId = experiment.id;
    const project = projectData;
    const projectId = project.id;

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const navigateToProject = () => {
        navigate(`/project/${projectId}`);
    }

    const navigateToExperiment = () => {
        navigate(`/experiment/${experimentId}`);
    }

    return (
        <Box>
            <DeleteStimuliModal showModal={showModal} closeModal={closeModal}
                                data={stimulus}></DeleteStimuliModal>
            <Card sx={{backgroundColor: 'inherit'}}>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <CardHeader sx={{padding: '5px'}}
                        subheader={
                            <Box sx={{display: 'flex'}}>
                                <Link
                                    id={"breadcrumb-to-project"}
                                    sx={{color: theme.palette.grey[500], textDecoration: 'none', cursor: 'pointer'}}
                                    onClick={navigateToProject}
                                >
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <FolderOpen/>&nbsp;
                                        <Typography sx={{fontWeight: 500}}>{project.name}</Typography>
                                    </Box>
                                </Link>
                                &nbsp;
                                <IconChevronRight/>
                                <Link
                                    id={"breadcrumb-to-experiment"}
                                    sx={{color: theme.palette.grey[500], textDecoration: 'none', cursor: 'pointer'}}
                                    onClick={navigateToExperiment}
                                >
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <IconFlask/>
                                        <Typography sx={{fontWeight: 500}}>{experiment.name}</Typography>
                                    </Box>
                                </Link>
                            </Box>
                        }>
                    </CardHeader>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                        <IconVideo/>
                        <CardHeader title={
                            <Typography sx={{
                                fontSize: '1.5rem',
                                fontWeight: 500
                            }}>
                                {stimulus.name}
                            </Typography>
                        } subheader={
                            <Typography>
                                {stimulus.description}
                            </Typography>
                        }/>
                    </Box>
                    <Box sx={{display: 'flex', gap: 1, pr: 2}}>
                        <AnimateButton>
                            <Button
                                id={"button-delete-stimuli"}
                                sx={{
                                    color: theme.palette.grey[700],
                                    backgroundColor: theme.palette.grey[50],
                                }}
                                onClick={openModal}
                            >
                                <IconTrashOff/>
                                <Typography sx={{display: isSmallScreen ? 'none' : 'flex'}}>
                                    Delete
                                </Typography>
                            </Button>
                        </AnimateButton>
                    </Box>
                </Box>
                </Box>


            </Card>

        </Box>
    );
};

StimuliHeader.propTypes = {
    stimulus: PropTypes.object,
    experimentData: PropTypes.object,
    projectData: PropTypes.object
}

export default StimuliHeader;