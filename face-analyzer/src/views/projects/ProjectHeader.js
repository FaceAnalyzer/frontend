import React, {useState} from 'react';
import {useTheme} from '@mui/material/styles';
import DeleteProjectModal from '../../ui-component/modals/projects/DeleteProjectModal';
import EditProjectModal from '../../ui-component/modals/projects/EditProjectModal';
import {Box, Button, Card, CardHeader, Typography, useMediaQuery} from '@mui/material';
import {gridSpacing} from '../../store/constant';
import AnimateButton from '../../ui-component/extended/AnimateButton';
import {IconEdit, IconFileAnalytics, IconTrashOff} from '@tabler/icons';
import {Troubleshoot} from '@mui/icons-material';

// ===========================|| PROJECT HEADER ||=========================== //

const ProjectHeader = ({data}) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
        window.location.href = '/project/{projectId}/researchers'.replace('{projectId}', project.id);
    };

    return (
        <Box>
            <DeleteProjectModal showModal={showDeleteModal} closeModal={closeDeleteModal}
                                data={project}></DeleteProjectModal>
            <EditProjectModal showModal={showEditModal} closeModal={closeEditModal}
                              initialValues={project}></EditProjectModal>
            <Card sx={{marginBottom: gridSpacing, backgroundColor: 'inherit'}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                        <IconFileAnalytics/>
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
                    <Box sx={{display: 'flex', gap: 1, pr: 2}}>
                        <AnimateButton>
                            <Button
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
                        <AnimateButton>
                            <Button
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