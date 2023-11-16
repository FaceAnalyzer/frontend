import PropTypes from 'prop-types';
import {useState} from 'react';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {Avatar, Box, Grid, Menu, MenuItem, Typography} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {DeleteForever, Download, Edit} from '@mui/icons-material';
import {IconFlask} from '@tabler/icons';

const CardWrapper = styled(MainCard)(({theme}) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative'
}));

// ===========================|| PROJECT CARD ||=========================== //

const ProjectCard = ({isLoading, data}) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const project = data;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openProject = () => {
        // window.location.href = '/project/' + project.id;
    }

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

    const onEditClick = () => {
        handleClose();
        openEditModal();
    }

    const openEditModal = () => {
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
    };

    // stop lint errors - remove after implementation
    closeEditModal();
    closeDeleteModal();
    console.log(showDeleteModal);
    console.log(showEditModal);

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard/>
            ) : (
                <CardWrapper border={false} content={false}>
                    {/*<DeleteProjectModal showModal={showDeleteModal}*/}
                    {/*                       closeModal={closeDeleteModal}*/}
                    {/*                       deleteName={project.name}*/}
                    {/*                       deleteId={project.id}></DeleteProjectModal>*/}
                    {/*<EditProjectModal showModal={showEditModal}*/}
                    {/*                     closeModal={closeEditModal}*/}
                    {/*                     initialValues={project}></EditProjectModal>*/}
                    <Box sx={{p: 2.25}}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: theme.palette.secondary.light,
                                                color: theme.palette.secondary.dark,
                                                mt: 1
                                            }}
                                            onClick={openProject}
                                        >
                                            <IconFlask/>
                                        </Avatar>
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
                                            aria-controls="menu-project-card"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <MoreHorizIcon fontSize="inherit"/>
                                        </Avatar>
                                        <Menu
                                            id="menu-project-card"
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
                                            <MenuItem onClick={handleClose}>
                                                <Download sx={{mr: 1.75}}/> Export
                                            </MenuItem>
                                            <MenuItem onClick={onEditClick}>
                                                <Edit sx={{mr: 1.75}}/> Edit
                                            </MenuItem>
                                            <MenuItem onClick={onDeleteClick}
                                                      sx={{color: 'red'}}>
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
                                            }}>{project.name}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

ProjectCard.propTypes = {
    isLoading: PropTypes.bool
};

export default ProjectCard;
