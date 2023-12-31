import PropTypes from 'prop-types';
import React, { useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    CardActionArea,
    Grid,
    Tooltip,
    Typography,
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import {IconPlus} from "@tabler/icons";

const CardWrapper = styled(MainCard)(({theme}) => ({
    backgroundColor: '#fff',
    color: theme.palette.secondary.dark,
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative'
}));

const GenericAddCard = ({
                            isLoading,
                            data,
                            iconComponent,
                            AddModal,
                            modalProps,
                     }) => {
    const theme = useTheme();
    const [showModal, setShowModal] = useState(false);
    const item = data;

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
                    <AddModal
                        showModal={showModal}
                        closeModal={closeModal}
                        {...modalProps}
                    />
                    <CardActionArea onClick={openModal} id={`add-${item.type}-button-card`}>
                        <Box sx={{ p: 2.25 }}>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Avatar
                                        variant="rounded"
                                        id={`add-${item.type}-icon`}
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor: '#fff',
                                            color: theme.palette.secondary.dark,
                                            borderColor: theme.palette.secondary.dark,
                                            borderStyle: 'solid',
                                            borderWidth: '2px',
                                        }}
                                        onClick={openModal}
                                    >
                                        {iconComponent}
                                    </Avatar>
                                </Grid>
                                <Grid item>
                                    <Avatar
                                        variant="rounded"
                                        id={`add-${item.type}-button`}
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
                                        aria-controls={`add-new-${item.type}-card`}
                                        aria-haspopup="true"
                                        onClick={openModal}
                                    >
                                        <IconPlus fontSize="inherit" />
                                    </Avatar>
                                </Grid>
                            </Grid>
                            <Tooltip
                                title={item.name}
                                enterDelay={500}
                                placement={'top'}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '2.125rem',
                                        fontWeight: 500,
                                        mr: 1,
                                        mt: 1.75,
                                        mb: 0.75,
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {item.name}
                                </Typography>
                            </Tooltip>
                            <Tooltip
                                title={item.description}
                                enterDelay={500}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: theme.palette.secondary[200],
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {item.description}
                                </Typography>
                            </Tooltip>
                        </Box>
                    </CardActionArea>
                </CardWrapper>
            )}
        </>
    );
};

GenericAddCard.propTypes = {
    isLoading: PropTypes.bool,
    data: PropTypes.object,
    iconComponent: PropTypes.node,
    AddModal: PropTypes.func,
};

export default GenericAddCard;
