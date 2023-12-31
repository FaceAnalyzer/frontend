import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    CardActionArea,
    Grid,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import {useAuth} from "../../context/authContext";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {DeleteForever, Edit} from "@mui/icons-material";

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
}));

const GenericCard = ({
                         isLoading,
                         data,
                         iconComponent,
                         DeleteModal,
                         EditModal,
                         openLink,
                     }) => {
    const {user} = useAuth();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const item = data;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openItem = () => {
        openLink(item.id);
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
    };

    const onEditClick = () => {
        handleClose();
        openEditModal();
    };

    const openEditModal = () => {
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
    };

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard/>
            ) : (
                <CardWrapper border={false} content={false}>
                    {DeleteModal && (
                    <DeleteModal
                        showModal={showDeleteModal}
                        closeModal={closeDeleteModal}
                        data={item}
                    />
                    )}
                    {EditModal && (
                    <EditModal
                        showModal={showEditModal}
                        closeModal={closeEditModal}
                        initialValues={item}
                    />
                    )}
                    <CardActionArea onClick={openItem} id={`card-open-${item.type}-${item.id}`}>
                        <Box sx={{ p: 2.25 }}>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Avatar
                                        variant="rounded"
                                        id={`button-open-${item.type}-${item.id}`}
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor: theme.palette.secondary.light,
                                            color: theme.palette.secondary.dark,
                                        }}
                                        onClick={openItem}
                                    >
                                        {iconComponent}
                                    </Avatar>
                                </Grid>
                                {user.role === 'Admin' && (
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            id={`menu-${item.type}-${item.id}`}
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.mediumAvatar,
                                                backgroundColor: theme.palette.secondary[800],
                                                color: theme.palette.secondary[200],
                                                zIndex: 1,
                                            }}
                                            aria-controls={`menu-${item.type}-card`}
                                            aria-haspopup="true"
                                            onMouseDown={(event) => event.stopPropagation()}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                event.preventDefault();
                                                handleClick(event);
                                            }}
                                        >
                                            <MoreHorizIcon fontSize="inherit" />
                                        </Avatar>
                                        <Menu
                                            id={`menu-${item.type}-card`}
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                            variant="selectedMenu"
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            onMouseDown={(event) => event.stopPropagation()}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                event.preventDefault();
                                            }}
                                        >
                                            {EditModal && (
                                            <MenuItem
                                                id={`menu-${item.type}-${item.id}-edit`}
                                                onMouseDown={(event) => event.stopPropagation()}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    event.preventDefault();
                                                    onEditClick(event);
                                                }}
                                            >
                                                <Edit sx={{ mr: 1.75 }} /> Edit
                                            </MenuItem>
                                            )}
                                            {DeleteModal && (
                                            <MenuItem
                                                id={`menu-${item.type}-${item.id}-delete`}
                                                onMouseDown={(event) => event.stopPropagation()}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    event.preventDefault();
                                                    onDeleteClick(event);
                                                }}
                                                sx={{ color: 'red' }}
                                            >
                                                <DeleteForever sx={{mr: 1.75}}/> Delete
                                            </MenuItem>
                                            )}
                                        </Menu>
                                    </Grid>
                                )}
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

GenericCard.propTypes = {
    isLoading: PropTypes.bool,
    data: PropTypes.object,
    iconComponent: PropTypes.node,
    DeleteModal: PropTypes.func,
    EditModal: PropTypes.func,
    openLink: PropTypes.func,
};

export default GenericCard;
