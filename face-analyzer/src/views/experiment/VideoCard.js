import PropTypes from 'prop-types';
import {useState} from 'react';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {Avatar, Box, Grid, Typography} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import {DeleteForever} from '@mui/icons-material';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative'
}));

// ===========================|| VIDEO CARD ||=========================== //

const VideoCard = ({isLoading, stimulus}) => {
    const theme = useTheme();

    const [, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    console.log(stimulus);

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.mediumAvatar,
                                                backgroundColor: theme.palette.secondary[800],
                                                color: theme.palette.secondary[200],
                                                zIndex: 1
                                            }}
                                            aria-controls="menu-video-card"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <DeleteForever fontSize="inherit" />
                                        </Avatar>
                                        </Grid>

                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <img src="https://i.ytimg.com/vi/xxxxxxxxxxx/hqdefault.jpg" alt="YouTube thumbnail" /> 
                                        {/* this should use youtube api with url to find thumbnail imo */}
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
                                    Video Title
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
      )}
    </>
  );
};

VideoCard.propTypes = {
  isLoading: PropTypes.bool
};

export default VideoCard;
