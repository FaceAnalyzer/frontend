import React, {useState} from 'react';
import PropTypes from 'prop-types';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {Avatar, Box, Grid, Typography} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import {IconVideo, IconPlus} from '@tabler/icons';
import AddVideoModal from './AddVideoModal';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: '#fff',
    color: theme.palette.secondary.dark,
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative'
}));

// ===========================|| ADD VIDEO CARD ||=========================== //

const AddVideoCard = ({ isLoading }) => {
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
                <SkeletonEarningCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <AddVideoModal showModal={showModal} closeModal={closeModal}/>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: '#fff',
                                                color: theme.palette.secondary.dark,
                                                mt: 1
                                            }}
                                        >
                                            <IconVideo />
                                        </Avatar>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
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
                                            aria-controls="add-new-video-card"
                                            aria-haspopup="true"
                                            onClick={openModal}
                                        >
                                            <IconPlus fontSize="inherit" />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>Add video</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 1.25 }}>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: theme.palette.secondary[200]
                                    }}
                                >
                                    Click to add a new video.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

AddVideoCard.propTypes = {
    isLoading: PropTypes.bool
};

export default AddVideoCard;
