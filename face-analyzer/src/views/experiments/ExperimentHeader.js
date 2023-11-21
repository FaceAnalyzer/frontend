import React, {useState} from 'react';
import {useTheme} from "@mui/material/styles";
import DeleteExperimentModal from "../../ui-component/modals/projects/DeleteExperimentModal";
import EditExperimentModal from "../../ui-component/modals/experiments/EditExperimentModal";
import {Box, Button, Card, CardHeader, Typography} from "@mui/material";
import {gridSpacing} from "../../store/constant";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import {IconEdit, IconFlask, IconTrashOff} from "@tabler/icons";

// ===========================|| EXPERIMENT HEADER ||=========================== //

const ExperimentHeader = ({data}) => {
    const theme = useTheme();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const experiment = data;

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
            <DeleteExperimentModal showModal={showDeleteModal}
                                   closeModal={closeDeleteModal}
                                   data={experiment}>
            </DeleteExperimentModal>
            <EditExperimentModal showModal={showEditModal}
                                 closeModal={closeEditModal}
                                 initialValues={experiment}></EditExperimentModal>
            <Card sx={{marginBottom: gridSpacing, backgroundColor: 'inherit'}}>
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

export default ExperimentHeader;