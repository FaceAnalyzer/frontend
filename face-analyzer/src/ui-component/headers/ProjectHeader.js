import React, {useState} from 'react';
import {useTheme} from '@mui/material/styles';
import DeleteProjectModal from '../modals/projects/DeleteProjectModal';
import EditProjectModal from '../modals/projects/EditProjectModal';
import {Box, Button, Card, CardHeader, Typography, useMediaQuery} from '@mui/material';
import AnimateButton from '../extended/AnimateButton';
import {IconEdit, IconTrashOff} from '@tabler/icons';
import {FolderOpen, Troubleshoot} from '@mui/icons-material';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/authContext";

// ===========================|| PROJECT HEADER ||=========================== //

const ProjectHeader = ({data}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const {user} = useAuth();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const project = data;

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const onDeleteClick = () => {
        openDeleteModal();
    };

    const onEditClick = () => {
        openEditModal();
    };

    const openEditModal = () => {
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
    };

    const openProjectResearchers = () => {
        navigate(`/project/${project.id}/researchers`);
    };

    return (
        <Box>
            <DeleteProjectModal showModal={showDeleteModal} closeModal={closeDeleteModal}
                                data={project}></DeleteProjectModal>
            <EditProjectModal showModal={showEditModal} closeModal={closeEditModal}
                              initialValues={project}></EditProjectModal>
            <Card sx={{backgroundColor: 'inherit'}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                        <FolderOpen/>
                        <CardHeader
                            title={
                                <Typography sx={{
                                    fontSize: '1.5rem',
                                    fontWeight: 500
                                }}>
                                    {project.name}
                                </Typography>
                            }
                        />
                    </Box>
                    <Box sx={{display: 'flex', gap: 1}}>
                        {user.role === 'Admin' && (
                        <AnimateButton>
                            <Button
                                id={"button-researchers-edit"}
                                disableElevation
                                onClick={openProjectResearchers}
                                variant="contained"
                                sx={{
                                    backgroundColor: theme.palette.secondary[800]
                                }}
                            >
                                <Troubleshoot/>
                                <Typography sx={{display: isSmallScreen ? 'none' : 'flex'}}>
                                    Edit researchers
                                </Typography>
                            </Button>
                        </AnimateButton>
                        )}
                        <AnimateButton>
                            <Button
                                id={"button-edit-project"}
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
                                id={"button-delete-project"}
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
            </Card>
        </Box>
    );
};

export default ProjectHeader;