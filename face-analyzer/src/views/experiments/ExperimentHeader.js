import React, {useState} from 'react';
import {useTheme} from "@mui/material/styles";
import DeleteExperimentModal from "../../ui-component/modals/projects/DeleteExperimentModal";
import EditExperimentModal from "../../ui-component/modals/experiments/EditExperimentModal";
import {Box, Button, Card, CardHeader, Link, Typography, useMediaQuery} from "@mui/material";
import {gridSpacing} from "../../store/constant";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import {IconClipboardList, IconEdit, IconFlask, IconTrashOff} from "@tabler/icons";
import {FolderOpen} from "@mui/icons-material";

// ===========================|| EXPERIMENT HEADER ||=========================== //

const ExperimentHeader = ({data, projectData}) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const projectId = data.projectId;
    console.log(projectId);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const experiment = data;
    const project = projectData;

    console.log("PROJ", project)

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const onDeleteClick = () => {
        openDeleteModal();
    }

    const onEditClick = () => {
        openEditModal();
    }

    const openEditModal = () => {
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
    };

    const openNotes = () => {
        window.location.href = window.location + "/notes";
    }

    return (
        <Box>
            <DeleteExperimentModal showModal={showDeleteModal}
                                   closeModal={closeDeleteModal}
                                   data={experiment}>
            </DeleteExperimentModal>
            <EditExperimentModal showModal={showEditModal}
                                 closeModal={closeEditModal}
                                 initialValues={experiment}></EditExperimentModal>
            <Card sx={{marginBottom: gridSpacing, backgroundColor: 'inherit'}}>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <CardHeader sx={{padding: '5px'}}
                                subheader={
                                    <Link id={"breadcrumb-to-project"} href={`/project/${projectId}`}
                                          sx={{color: theme.palette.grey[500], textDecoration: 'none'}}
                                    >
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <FolderOpen/>
                                            <Typography sx={{fontWeight: 500}}>{project.name}</Typography>
                                        </Box>
                                    </Link>
                                }/>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                            <IconFlask/>
                            <CardHeader title={
                                <Typography sx={{
                                    fontSize: '1.5rem',
                                    fontWeight: 500
                                }}>
                                    {experiment.name}
                                </Typography>
                            } subheader={
                                <Typography>
                                    {experiment.description}
                                </Typography>
                            }/>
                        </Box>
                        <Box sx={{display: 'flex', gap: 1, pr: 2}}>
                            <AnimateButton>
                                <Button
                                    id={"button-notes"}
                                    disableElevation
                                    onClick={openNotes}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: theme.palette.secondary[800]
                                    }}
                                >
                                    <IconClipboardList/>
                                    <Typography sx={{display: isSmallScreen ? 'none' : 'flex'}}>
                                        Notes
                                    </Typography>
                                </Button>
                            </AnimateButton>
                            <AnimateButton>
                                <Button
                                    id={"button-edit-experiment"}
                                    disableElevation
                                    onClick={onEditClick}
                                    variant="contained"
                                    color="secondary"
                                >
                                    <IconEdit/>
                                    <Typography sx={{display: isSmallScreen ? 'none' : 'flex'}}>
                                        Edit
                                    </Typography>
                                </Button>
                            </AnimateButton>
                            <AnimateButton>
                                <Button
                                    id={"button-delete-experiment"}
                                    onClick={onDeleteClick}
                                    sx={{
                                        color: theme.palette.grey[700],
                                        backgroundColor: theme.palette.grey[50],
                                    }}
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

export default ExperimentHeader;