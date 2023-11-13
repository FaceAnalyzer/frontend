import React, {useState} from 'react';
import {useTheme} from "@mui/material/styles";
import DeleteExperimentModal from "../projects/DeleteExperimentModal";
import EditExperimentModal from "./EditExperimentModal";
import {Box, Button, Card, CardHeader, Typography} from "@mui/material";
import {gridSpacing} from "../../store/constant";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import {IconEdit, IconTrashOff} from "@tabler/icons";

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
                                   deleteName={experiment.name}
                                   deleteId={experiment.id}></DeleteExperimentModal>
            <EditExperimentModal showModal={showEditModal}
                                 closeModal={closeEditModal}
                                 initialValues={experiment}></EditExperimentModal>
            <Card sx={{marginBottom: gridSpacing, backgroundColor: 'inherit'}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <CardHeader title={
                        <Typography sx={{
                            fontSize: '1.5rem',
                            fontWeight: 500
                        }}>
                            {experiment.name}</Typography>
                    } subheader={
                        <Typography>
                            {experiment.description}
                        </Typography>
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

export default ExperimentHeader;