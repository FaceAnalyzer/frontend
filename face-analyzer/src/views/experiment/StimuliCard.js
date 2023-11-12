import PropTypes from 'prop-types';
import {useState} from 'react';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {Avatar, Box, Grid, Typography} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import {DeleteForever, YouTube} from "@mui/icons-material";
import {IconVideo} from "@tabler/icons";

// assets

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative'
}));

// ===========================|| STIMULI CARD ||=========================== //

const StimuliCard = ({isLoading, data}) => {
    const theme = useTheme();
    const stimulus = data;

    // const match = stimulus.link.match(/[?&]v=([^&]+)/);
    // const urlHash = match ? match[1] : null;
    // const imageSource = 'https://i.ytimg.com/vi/' + urlHash + '/default.jpg';

    const [, setAnchorEl] = useState(null);

    const openStimuliLink = () => {
        window.open(stimulus.link, '_blank');
    };

    const openStimuli = () => {
        window.location.href = '/stimuli/' + stimulus.id;
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

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
                                        <Grid container justifyContent="center">
                                            <Grid item sx={{paddingRight: '5px'}}>
                                                <Avatar
                                                    variant="rounded"
                                                    sx={{
                                                        ...theme.typography.commonAvatar,
                                                        ...theme.typography.largeAvatar,
                                                        backgroundColor: theme.palette.secondary.light,
                                                        color: theme.palette.secondary.dark,
                                                        mt: 1
                                                    }}
                                                    onClick={openStimuli}
                                                >
                                                    <IconVideo/>
                                                </Avatar>
                                            </Grid>
                                            <Grid item sx={{paddingLeft: '5px'}}>
                                                <Avatar
                                                    variant="rounded"
                                                    sx={{
                                                        ...theme.typography.commonAvatar,
                                                        ...theme.typography.largeAvatar,
                                                        backgroundColor: theme.palette.secondary.light,
                                                        color: theme.palette.secondary.dark,
                                                        mt: 1
                                                    }}
                                                    onClick={openStimuliLink}
                                                >
                                                    <YouTube/>
                                                </Avatar>
                                            </Grid>
                                        </Grid>
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
                                            aria-controls="menu-stimulus-card"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <DeleteForever fontSize="inherit"/>
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/*<Grid item>*/}
                            {/*    <Grid container alignItems="center">*/}
                            {/*        <Grid item>*/}
                            {/*            <img src={imageSource} alt="YouTube thumbnail"/>*/}
                            {/*        </Grid>*/}
                            {/*    </Grid>*/}
                            {/*</Grid>*/}
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography
                                            sx={{
                                                fontSize: '2.125rem',
                                                fontWeight: 500,
                                                mr: 1,
                                                mt: 1.75,
                                                mb: 0.75
                                            }}>Stimulus Title</Typography>
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
                                    {stimulus.description}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
      )}
    </>
  );
};

StimuliCard.propTypes = {
  isLoading: PropTypes.bool
};

export default StimuliCard;