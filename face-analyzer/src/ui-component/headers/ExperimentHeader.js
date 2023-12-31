import React, {useState} from 'react';
import {useTheme} from "@mui/material/styles";
import DeleteExperimentModal from "../modals/projects/DeleteExperimentModal";
import EditExperimentModal from "../modals/projects/EditExperimentModal";
import {Box, Button, Card, CardHeader, Link, Typography, useMediaQuery} from "@mui/material";
import AnimateButton from "../extended/AnimateButton";
import {IconClipboardList, IconDownload, IconEdit, IconFlask, IconTrashOff} from "@tabler/icons";
import {FolderOpen} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {GET_EXPORT_EXPERIMENT} from "../../endpoints/BackendEndpoints";
import PropTypes from "prop-types";

// ===========================|| EXPERIMENT HEADER ||=========================== //

const ExperimentHeader = ({data, projectData}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const projectId = data.projectId;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const experiment = data;
    const project = projectData;

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
        navigate(`/experiment/${experiment.id}/notes`);
    }

    const navigateToProject = () => {
        navigate(`/project/${projectId}`);
    }

    const downloadCollectiveCSV = () => {
        console.log("clicked dl button");
        axios.get(GET_EXPORT_EXPERIMENT.replace('{id}', experiment.id), {responseType: "blob"})
            .then((response) => {
                const href = URL.createObjectURL(response.data);

                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', 'CollectiveData.zip');
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });

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
            <Card sx={{backgroundColor: 'inherit'}}>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <CardHeader sx={{padding: '5px'}}
                                subheader={
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
                                    id={"button-export-csv"}
                                    sx={{color: theme.palette.secondary}}
                                    variant={'contained'}
                                    disableElevation
                                    onClick={downloadCollectiveCSV}
                                >
                                    <IconDownload/> Export Experiment
                                </Button>
                            </AnimateButton>
                            <AnimateButton>
                                <Button
                                    id={"button-notes-" + experiment.id}
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

ExperimentHeader.propTypes = {
    projectData: PropTypes.object,
    data: PropTypes.object
}

export default ExperimentHeader;