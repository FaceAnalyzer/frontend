import React from 'react';
import {useTheme} from "@mui/material/styles";
import {Box, Button, CardHeader, Link, Typography} from "@mui/material";
import AnimateButton from "../extended/AnimateButton";
import {IconChevronRight, IconDownload, IconFlask, IconGraph, IconVideo} from "@tabler/icons";
import PropTypes from "prop-types";
import {FolderOpen} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {GET_EXPORT_REACTION} from "../../endpoints/BackendEndpoints";

// ===========================|| CHART HEADER ||=========================== //

const ChartHeader = ({
                         activeButton,
                         setActiveButton,
                         reactionData,
                         stimuliData,
                         experimentData,
                         projectData
                     }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const reaction = reactionData;
    const reactionId = reactionData.id;
    const stimuli = stimuliData;
    const stimuliId = stimuli.id;
    const experiment = experimentData;
    const experimentId = experiment.id;
    const project = projectData;
    const projectId = project.id;

    const handleButtonClick = (buttonType) => {
        setActiveButton(buttonType);
    };

    const downloadCSV = () => {
        axios.get(GET_EXPORT_REACTION.replace('{id}', reactionId), {responseType: "blob"})
            .then((response) => {
                const href = URL.createObjectURL(response.data);

                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', `${stimuliId}.${stimuli.name}-${reaction.participantName}.csv`);
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            })
    }

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
                            }/>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <IconGraph/>
                <CardHeader title={
                    <Typography sx={{
                        fontSize: '1.5rem',
                        fontWeight: 500
                    }}>
                        {reaction.participantName}
                    </Typography>
                }/>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', gap: 1, pr: 2}}>
                    <AnimateButton>
                        <Button
                            id={"button-emotions-over-time"}
                            onClick={() => handleButtonClick('overTime')}
                            sx={activeButton === 'overTime' ? {
                                color: theme.palette.secondary
                            } : {
                                color: theme.palette.grey[700],
                                backgroundColor: theme.palette.grey[50],
                            }}
                            variant={activeButton === 'overTime' ? 'contained' : ''}
                            disableElevation
                        >
                            Emotions over time
                        </Button>
                    </AnimateButton>
                    <AnimateButton>
                        <Button
                            id={"button-emotions-distribution"}
                            onClick={() => handleButtonClick('distribution')}
                            sx={activeButton === 'distribution' ? {
                                color: theme.palette.secondary
                            } : {
                                color: theme.palette.grey[700],
                                backgroundColor: theme.palette.grey[50],
                            }}
                            variant={activeButton === 'distribution' ? 'contained' : ''}
                            disableElevation
                        >
                            Emotions distribution
                        </Button>
                    </AnimateButton>
                    <AnimateButton>
                        <Button
                            id={"button-dynamic-chart"}
                            onClick={() => handleButtonClick('dynamic')}
                            sx={activeButton === 'dynamic' ? {
                                color: theme.palette.secondary
                            } : {
                                color: theme.palette.grey[700],
                                backgroundColor: theme.palette.grey[50],
                            }}
                            variant={activeButton === 'dynamic' ? 'contained' : ''}
                            disableElevation
                        >
                            Dynamic chart
                        </Button>
                    </AnimateButton>
                </Box>
                <Box>
                    <AnimateButton>
                        <Button
                            id={"button-export-csv"}
                            sx={{color: theme.palette.secondary}}
                            variant={'contained'}
                            disableElevation
                            onClick={downloadCSV}
                        >
                            <IconDownload/> Export CSV
                        </Button>
                    </AnimateButton>
                </Box>
            </Box>
        </Box>
    );
};

ChartHeader.propTypes = {
    activeButton: PropTypes.string,
    setActiveButton: PropTypes.func,
    emotionsData: PropTypes.object,
    reactionData: PropTypes.object
}

export default ChartHeader;