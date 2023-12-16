import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {Avatar, Box, Grid, Typography} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import {FolderOpen} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {IconUser} from "@tabler/icons";

const CardWrapper = styled(MainCard)(({theme}) => ({
    backgroundColor: '#fff',
    color: theme.palette.secondary.dark,
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative'
}));

// ===========================|| DASHBOARD CARD ||=========================== //

const DashboardCard = ({isLoading, component}) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const openPage = () => {
        navigate(component.toLowerCase());
    };


    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard/>
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{p: 2.25}} onClick={openPage}>
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
                                            {component === "Projects" ? <FolderOpen/> : <IconUser/>}
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography
                                            sx={{fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75}}>
                                            {component}
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
                                    View all {component.toLowerCase()}.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

DashboardCard.propTypes = {
    isLoading: PropTypes.bool
};

export default DashboardCard;
