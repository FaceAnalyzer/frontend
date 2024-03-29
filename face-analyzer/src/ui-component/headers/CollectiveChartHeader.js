import React from 'react';
import {useTheme} from "@mui/material/styles";
import {Box, Button, CardHeader, Link, Typography} from "@mui/material";
import {IconChevronRight, IconDownload, IconFlask, IconGraph, IconVideo} from "@tabler/icons";
import PropTypes from "prop-types";
import {FolderOpen} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import AnimateButton from "../extended/AnimateButton";
import axios from "axios";
import {GET_EXPORT_REACTION} from "../../endpoints/BackendEndpoints";
import JSZip from 'jszip';

// ===========================|| CHART HEADER ||=========================== //

const CollectiveChartHeader = ({
                         stimuliData,
                         experimentData,
                         projectData,
                         reactionList,
                     }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const stimuli = stimuliData;
    const stimuliId = stimuli.id;
    const experiment = experimentData;
    const experimentId = experiment.id;
    const project = projectData;
    const projectId = project.id;

    const zip = new JSZip();

    const navigateToProject = () => {
        navigate(`/project/${projectId}`);
    }

    const navigateToExperiment = () => {
        navigate(`/experiment/${experimentId}`);
    }

    const navigateToStimuli = () => {
        navigate(`/stimuli/${stimuliId}`);
    }

    const downloadCollectiveCSV = () => {
        const promises = [];

        reactionList.forEach(reaction => {
            promises.push(
                axios.get(GET_EXPORT_REACTION.replace('{id}', reaction.id), {responseType: "blob"})
                    .then((response) => {
                        zip.file(`${stimuliId}.${stimuli.name}-${reaction.participantName}.csv`, response.data);
                    })
                    .catch((e) => {
                        console.error(`Error fetching data for ${reaction.participantName}`, e);
                    })
            )
        });

        Promise.all(promises)
            .then(() => {
                zip.generateAsync({type: 'blob'})
                    .then((content) => {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(content);
                        link.download = 'collective_data.zip';
                        link.click();

                        URL.revokeObjectURL(link.href);
                    })
                    .catch((e) => {
                        console.error('Error generating zip file.', e);
                    })
            })
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
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
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
                <Box>
                    <AnimateButton>
                        <Button
                            id={"button-export-csv"}
                            sx={{color: theme.palette.secondary}}
                            variant={'contained'}
                            disableElevation
                            onClick={downloadCollectiveCSV}
                        >
                            <IconDownload/> Export Collective CSV
                        </Button>
                    </AnimateButton>
                </Box>
            </Box>
        </Box>
    );
};

CollectiveChartHeader.propTypes = {
    stimuliData: PropTypes.object,
    experimentData: PropTypes.object,
    projectData: PropTypes.object,
    reactionList: PropTypes.array,
}

export default CollectiveChartHeader;