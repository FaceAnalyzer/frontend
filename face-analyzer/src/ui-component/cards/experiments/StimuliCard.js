import PropTypes from 'prop-types';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {Avatar, Box, CardActionArea, Grid, Menu, MenuItem, Typography} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import {DeleteForever, YouTube} from "@mui/icons-material";
import {IconVideo} from "@tabler/icons";
import DeleteStimuliModal from "../../modals/experiments/DeleteStimuliModal";
import {useState} from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

// assets
import {useNavigate} from "react-router-dom";

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative'
}));

// ===========================|| STIMULI CARD ||=========================== //

const StimuliCard = ({isLoading, data}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const stimulus = data;

    const [showModal, setShowModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    // const match = stimulus.link.match(/[?&]v=([^&]+)/);
    // const urlHash = match ? match[1] : null;
    // const imageSource = 'https://i.ytimg.com/vi/' + urlHash + '/default.jpg';

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openStimulusLink = () => {
        window.open(stimulus.link, '_blank');
    };

    const openStimulus = () => {
        navigate('/stimuli/' + stimulus.id);
    }

    const openModal = () => {
        handleClose();
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
                    <DeleteStimuliModal showModal={showModal} closeModal={closeModal}
                                        data={stimulus}></DeleteStimuliModal>
                    <CardActionArea onClick={openStimulus} id={"card-open-stimulus-" + stimulus.id}>
                        <Box sx={{ p: 2.25 }}>
                            <Grid container direction="column">
                                <Grid item>
                                    <Grid container justifyContent="space-between">
                                        <Grid item>
                                            <Grid container justifyContent="center">
                                                <Grid item sx={{paddingRight: '5px'}}>
                                                    <Avatar
                                                        id={"button-open-stimulus-" + stimulus.id}
                                                        variant="rounded"
                                                        sx={{
                                                            ...theme.typography.commonAvatar,
                                                            ...theme.typography.largeAvatar,
                                                            backgroundColor: theme.palette.secondary.light,
                                                            color: theme.palette.secondary.dark,
                                                        }}
                                                        onClick={openStimulus}
                                                    >
                                                        <IconVideo/>
                                                    </Avatar>
                                                </Grid>
                                                <Grid item sx={{paddingLeft: '5px'}}>
                                                    <Avatar
                                                        id={"link-stimulus-" + stimulus.id}
                                                        variant="rounded"
                                                        sx={{
                                                            ...theme.typography.commonAvatar,
                                                            ...theme.typography.largeAvatar,
                                                            backgroundColor: theme.palette.secondary.light,
                                                            color: theme.palette.secondary.dark,
                                                        }}
                                                        onMouseDown={event => event.stopPropagation()}
                                                        onClick={event => {
                                                            event.stopPropagation();
                                                            event.preventDefault();
                                                            openStimulusLink()
                                                            }
                                                        }
                                                    >
                                                        <YouTube/>
                                                    </Avatar>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Avatar
                                                id={"button-delete-stimulus-" + stimulus.id}
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
                                                onMouseDown={event => event.stopPropagation()}
                                                onClick={event => {
                                                    event.stopPropagation();
                                                    event.preventDefault();
                                                    handleClick(event)
                                                    }
                                                }
                                            >
                                                <MoreHorizIcon fontSize="inherit"/>
                                            </Avatar>
                                            <Menu
                                                id="menu-stimulus-card"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={Boolean(anchorEl)}
                                                onClose={handleClose}
                                                variant="selectedMenu"
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right'
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right'
                                                }}
                                                onMouseDown={event => event.stopPropagation()}
                                                onClick={event => {
                                                    event.stopPropagation();
                                                    event.preventDefault();
                                                    }
                                                }
                                            >
                                                <MenuItem
                                                    id={"menu-stimulus-" + stimulus.id + "-delete"}
                                                    onMouseDown={event => event.stopPropagation()}
                                                    onClick={event => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        openModal()
                                                        }
                                                    }
                                                    sx={{color: 'red'}}
                                                >
                                                    <DeleteForever sx={{mr: 1.75}}/> Delete
                                                </MenuItem>
                                            </Menu>
                                        </Grid>
                                    </Grid>
                                </Grid>
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
                                                }}>{stimulus.name}</Typography>
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
                    </CardActionArea>
                </CardWrapper>
      )}
    </>
  );
};

StimuliCard.propTypes = {
  isLoading: PropTypes.bool
};

export default StimuliCard;
