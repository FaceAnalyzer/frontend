import React from 'react';
import {useTheme} from "@mui/material/styles";
import {Box, CardHeader, Link, Typography} from "@mui/material";
import {IconChevronRight, IconFlask, IconGraph, IconVideo} from "@tabler/icons";
import PropTypes from "prop-types";
import {FolderOpen} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

// ===========================|| CHART HEADER ||=========================== //

const CollectiveChartHeader = ({
                         stimuliData,
                         experimentData,
                         projectData
                     }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const stimuli = stimuliData;
    const stimuliId = stimuli.id;
    const experiment = experimentData;
    const experimentId = experiment.id;
    const project = projectData;
    const projectId = project.id;

    const navigateToProject = () => {
        navigate(`/project/${projectId}`);
    }

    const navigateToExperiment = () => {
        navigate(`/experiment/${experimentId}`);
    }

    const navigateToStimuli = () => {
        navigate(`/stimuli/${stimuliId}`);
    }

    return (
        <Box>
            <Box>
                <CardHeader
                    sx={{padding: '5px'}}
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
                            <IconChevronRight />
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
                            &nbsp;
                            <IconChevronRight />
                            <Link
                                id={"breadcrumb-to-stimuli"}
                                sx={{color: theme.palette.grey[500], textDecoration: 'none', cursor: 'pointer'}}
                                onClick={navigateToStimuli}
                            >
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <IconVideo/>&nbsp;
                                    <Typography sx={{fontWeight: 500}}>{stimuli.name}</Typography>
                                </Box>
                            </Link>
                        </Box>
                    }
                />
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <IconGraph/>
                <CardHeader title={
                    <Typography sx={{
                        fontSize: '1.5rem',
                        fontWeight: 500
                    }}>
                        {stimuliData.name}
                    </Typography>
                }/>
            </Box>
        </Box>
    );
};

CollectiveChartHeader.propTypes = {
    activeButton: PropTypes.string,
    setActiveButton: PropTypes.func,
    emotionsData: PropTypes.object,
    reactionData: PropTypes.object
}

export default CollectiveChartHeader;