import PropTypes from 'prop-types';
import React, {useState} from 'react';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {Avatar, Box, Grid, Menu, MenuItem, Typography} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {DeleteForever, OpenInFull} from '@mui/icons-material';
import EditNoteModal from "../../../modals/experiments/notes/EditNoteModal";
import DeleteNoteModal from "../../../modals/experiments/notes/DeleteNoteModal";

const CardWrapper = styled(MainCard)(({theme}) => ({
    backgroundColor: '#fff',
    color: theme.palette.secondary.dark,
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
    height: '184.7px'
}));
// ===========================|| NOTE CARD ||=========================== //

const NoteCard = ({isLoading, data}) => {
    const theme = useTheme();
    // const {user} = useAuth();

    const [anchorEl, setAnchorEl] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const note = data;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const onDeleteClick = () => {
        handleClose();
        openDeleteModal();
    }

    const onShowClick = () => {
        handleClose();
        openShowModal();
    }

    const openShowModal = () => {
        setShowModal(true);
    };

    const closeShowModal = () => {
        setShowModal(false);
    };

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard/>
            ) : (
                <CardWrapper border={false} content={false}>
                    <EditNoteModal showModal={showModal}
                                   closeModal={closeShowModal}
                                   note={note}/>
                    <DeleteNoteModal showModal={showDeleteModal}
                                     closeModal={closeDeleteModal}
                                     data={note}/>
                    <Box sx={{p: 2.25}}>
                        <Grid container direction="column">
                            <Grid item sx={{mb: 1.25}}>
                                <Grid container justifyContent="space-between">
                                    <Grid item sx={{mb: 1.25}}>
                                        <Typography
                                            sx={{
                                                fontSize: '1rem',
                                                fontWeight: 500,
                                                color: theme.palette.secondary[200]
                                            }}
                                        >
                                            {/*{user.name} {user.surname}*/}
                                            Note
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            id={"menu-notes-card-" + note.id}
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.mediumAvatar,
                                                color: theme.palette.secondary[800],
                                                backgroundColor: theme.palette.secondary[200],
                                                zIndex: 1
                                            }}
                                            aria-controls="menu-note-card"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <MoreHorizIcon fontSize="inherit"/>
                                        </Avatar>
                                        <Menu
                                            id="menu-note-card"
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
                                        >
                                            <MenuItem id={"button-show-note-" + note.id} onClick={onShowClick}>
                                                <OpenInFull sx={{mr: 1.75}}/> View
                                            </MenuItem>
                                            <MenuItem id={"button-delete-note-" + note.id} onClick={onDeleteClick}
                                                      sx={{color: 'red'}}>
                                                <DeleteForever sx={{mr: 1.75}}/> Delete
                                            </MenuItem>
                                        </Menu>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    {/*TODO fix displayed length - bugs up on smaller screens*/}
                                    {note.description.length > 230 ? note.description.substring(0, 230) + "..." : note.description}
                                </Grid>
                            </Grid>

                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

NoteCard.propTypes = {
    isLoading: PropTypes.bool
};

export default NoteCard;
