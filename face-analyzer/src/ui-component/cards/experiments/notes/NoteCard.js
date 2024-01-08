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
import {DeleteForever, Edit, OpenInFull} from '@mui/icons-material';
import EditNoteModal from "../../../modals/experiments/notes/EditNoteModal";
import DeleteNoteModal from "../../../modals/experiments/notes/DeleteNoteModal";
import {useAuth} from "../../../../context/authContext";

const CardWrapper = styled(MainCard)(({theme}) => ({
    backgroundColor: '#fff',
    color: theme.palette.secondary.dark,
    borderColor: theme.palette.secondary.dark,
    borderWidth: '1rem',
    overflow: 'hidden',
    position: 'relative',
    height: '100%'
}));
// ===========================|| NOTE CARD ||=========================== //

const NoteCard = ({isLoading, data}) => {
    const theme = useTheme();
    const {user} = useAuth();

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
                        <Grid container justifyContent="space-between">
                            <Grid item sx={{mb: 1.25}}>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: theme.palette.secondary[200]
                                    }}
                                >
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
                                    id="menu-note-card"
                                    onMouseDown={event => event.stopPropagation()}
                                    onClick={event => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                    }
                                    }
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
                                    <MenuItem
                                        id={"button-show-note-" + note.id}
                                        onMouseDown={event => event.stopPropagation()}
                                        onClick={event => {
                                            event.stopPropagation();
                                            event.preventDefault();
                                            onShowClick()
                                        }
                                        }
                                    >
                                        {(user.id === note.creatorId) ?
                                            (<><Edit sx={{mr: 1.75}}/> Edit</>) :
                                            (<><OpenInFull sx={{mr: 1.75}}/> View</>)}
                                    </MenuItem>
                                    <MenuItem
                                        id={"button-delete-note-" + note.id}
                                        onMouseDown={event => event.stopPropagation()}
                                        onClick={event => {
                                            event.stopPropagation();
                                            event.preventDefault();
                                            onDeleteClick()
                                        }
                                        }
                                        sx={{color: 'red'}}
                                    >
                                        <DeleteForever sx={{mr: 1.75}}/> Delete
                                    </MenuItem>
                                </Menu>
                            </Grid>
                        </Grid>
                        <Typography
                            sx={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                mr: 1,
                                mt: 1.75,
                                mb: 0.75,
                                overflow: 'hidden',
                                wordWrap: 'break-word',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: '3',
                            }}
                        >
                            {note.description}
                        </Typography>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

NoteCard.propTypes = {
    isLoading: PropTypes.bool,
    data: PropTypes.object,
};

export default NoteCard;
