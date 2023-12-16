import React, {useState} from 'react';
import PropTypes from 'prop-types';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {Avatar, Box, Grid, Typography} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import {IconPlus} from '@tabler/icons';
import AddProjectModal from "../../modals/projects/AddProjectModal";
import {FolderOpen} from "@mui/icons-material";

const CardWrapper = styled(MainCard)(({theme}) => ({
    backgroundColor: '#fff',
    color: theme.palette.secondary.dark,
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative'
}));

// ===========================|| ADD PROJECT CARD ||=========================== //

const AddProjectCard = ({isLoading}) => {
    const theme = useTheme();
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard/>
            ) : (
                <CardWrapper border={false} content={false}>
                    <AddProjectModal showModal={showModal} closeModal={closeModal}/>
                    <Box sx={{p: 2.25}} onClick={openModal}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            id={"add-project-icon"}
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: '#fff',
                                                color: theme.palette.secondary.dark,
                                                borderColor: theme.palette.secondary.dark,
                                                borderStyle: 'solid',
                                                borderWidth: '2px',
                                            }}
                                        >
                                            <FolderOpen/>
                                        </Avatar>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            id={"add-project-button"}
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.mediumAvatar,
                                                backgroundColor: "#fff",
                                                color: theme.palette.secondary.dark,
                                                borderStyle: 'solid',
                                                borderWidth: '2px',
                                                borderColor: theme.palette.secondary.dark,
                                                borderRadius: '1rem',
                                                zIndex: 1
                                            }}
                                            aria-controls="add-new-project-card"
                                            aria-haspopup="true"
                                        >
                                            <IconPlus fontSize="inherit"/>
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography
                                            sx={{fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75}}>
                                            Add project
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{mb: 1.25}}>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: theme.palette.secondary[200]
                                    }}
                                >
                                    Click to add a new project.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

AddProjectCard.propTypes = {
    isLoading: PropTypes.bool
};

export default AddProjectCard;
