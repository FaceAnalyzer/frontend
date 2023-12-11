import React, {useState} from 'react';
import {useTheme} from "@mui/material/styles";
import {Box, Button, Card, CardHeader, Link, Typography, useMediaQuery} from "@mui/material";
import {gridSpacing} from "../../store/constant";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import {IconChevronRight, IconFlask, IconTrashOff, IconVideo} from "@tabler/icons";
import PropTypes from "prop-types";
import DeleteStimuliModal from "../../ui-component/modals/experiments/DeleteStimuliModal";
import {FolderOpen} from "@mui/icons-material";

// ===========================|| STIMULI HEADER ||=========================== //

const StimuliHeader = ({stimulus, experimentData, projectData}) => {
    const theme = useTheme();
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

    return (
        <Box>
            <DeleteStimuliModal showModal={showModal} closeModal={closeModal}
                                data={stimulus}></DeleteStimuliModal>
            <Card sx={{marginBottom: gridSpacing, backgroundColor: 'inherit'}}>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <CardHeader sx={{padding: '5px'}}
                                subheader={
                                    <Box sx={{display: 'flex'}}>
                                        <Link href={`/project/${projectId}`}
                                              sx={{color: theme.palette.grey[500], textDecoration: 'none'}}
                                        >
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <FolderOpen/>
                                                <Typography sx={{fontWeight: 500}}>{project.name}</Typography>
                                            </Box>
                                        </Link>
                                        &nbsp;
                                        <IconChevronRight/>
                                        <Link href={`/experiment/${experimentId}`}
                                              sx={{color: theme.palette.grey[500], textDecoration: 'none'}}
                                        >
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <IconFlask/>
                                                <Typography sx={{fontWeight: 500}}>{experiment.name}</Typography>
                                            </Box>
                                        </Link>
                                    </Box>
                                }/>
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
    stimulus: PropTypes.object
}

export default StimuliHeader;