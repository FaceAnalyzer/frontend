import React, {useState} from 'react';
import {useTheme} from "@mui/material/styles";
import DeleteProjectModal from "../../ui-component/modals/projects/DeleteProjectModal";
import EditProjectModal from "../../ui-component/modals/projects/EditProjectModal";
import {Box, Button, Card, CardHeader, Typography} from "@mui/material";
import {gridSpacing} from "../../store/constant";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import {IconEdit, IconTrashOff} from "@tabler/icons";

// ===========================|| PROJECT HEADER ||=========================== //

const ProjectHeader = ({data}) => {
    const theme = useTheme();

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

    return (
        <Box>
            <DeleteProjectModal showModal={showDeleteModal}
                                closeModal={closeDeleteModal}
                                deleteName={project.name}
                                deleteId={project.id}></DeleteProjectModal>
            <EditProjectModal showModal={showEditModal}
                              closeModal={closeEditModal}
                              initialValues={project}></EditProjectModal>
            <Card sx={{marginBottom: gridSpacing, backgroundColor: 'inherit'}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <CardHeader title={
                        <Typography sx={{
                            fontSize: '1.5rem',
                            fontWeight: 500
                        }}>
                            {project.name}</Typography>
                    }/>
                    <Box sx={{display: 'flex', gap: 1, pr: 2}}>
                        <AnimateButton>
                            <Button
                                disableElevation
                                onClick={onEditClick}
                                variant="contained"
                                color="secondary"
                            >
                                <IconEdit/> Edit
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
                                <IconTrashOff/> Delete
                            </Button>
                        </AnimateButton>
                    </Box>
                </Box>
            </Card>

        </Box>
    );
};

export default ProjectHeader;