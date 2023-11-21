import React, {useState} from 'react';
import {useTheme} from "@mui/material/styles";
import {Box, Button, Card, CardHeader, Typography} from "@mui/material";
import {gridSpacing} from "../../store/constant";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import {IconTrashOff, IconVideo} from "@tabler/icons";
import PropTypes from "prop-types";
import DeleteStimuliModal from "../../ui-component/modals/experiments/DeleteStimuliModal";

// ===========================|| STIMULI HEADER ||=========================== //

const StimuliHeader = ({stimulus}) => {
    const theme = useTheme();
    const [showModal, setShowModal] = useState(false);

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
                                <IconTrashOff/> Delete
                            </Button>
                        </AnimateButton>
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