import React, {useState} from 'react';
import {useTheme} from "@mui/material/styles";
import DeletePopup from "../projects/DeletePopup";
import EditExperimentModal from "./EditExperimentModal";
import {Box, Button, Card, CardHeader, Typography} from "@mui/material";
import {gridSpacing} from "../../store/constant";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import {IconEdit, IconTrashOff} from "@tabler/icons";

// ===========================|| EXPERIMENT HEADER ||=========================== //

const ExperimentHeader = () => {
    const theme = useTheme();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const experimentValues = {
        id: 1,
        name: "Experiment name",
        description: "Experiment description"
    };

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
            <DeletePopup showModal={showDeleteModal}
                         closeModal={closeDeleteModal}
                         deleteName={'Experiment name'}
                         deleteId={1}></DeletePopup>
            <EditExperimentModal showModal={showEditModal}
                                 closeModal={closeEditModal}
                                 initialValues={experimentValues}></EditExperimentModal>
            <Card sx={{marginBottom: gridSpacing}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <CardHeader title={
                        <Typography sx={{
                            fontSize: '1.5rem',
                            fontWeight: 500
                        }}>
                            {experimentValues.name}</Typography>
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
                                    color: 'grey.700',
                                    backgroundColor: theme.palette.grey[50],
                                    borderColor: theme.palette.grey[100]
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