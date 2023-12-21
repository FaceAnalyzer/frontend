import PropTypes from 'prop-types';

// material-ui
import {styled, useTheme} from '@mui/material/styles';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import {Avatar, Box, CardActionArea, Grid, Menu, MenuItem, Typography} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {DeleteForever, Edit, FolderOpen} from "@mui/icons-material";
import {useState} from "react";
import EditProjectModal from "../../modals/projects/EditProjectModal";
import DeleteProjectModal from "../../modals/projects/DeleteProjectModal";

// assets
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../../context/authContext";

const CardWrapper = styled(MainCard)(({theme}) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative'
}));

// ===========================|| PROJECT CARD ||=========================== //

const ProjectCard = ({isLoading, data}) => {
    const user = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();

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
        navigate('/project/' + project.id);
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

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard/>
            ) : (
                <CardWrapper border={false} content={false}>
                    <DeleteProjectModal showModal={showDeleteModal}
                                        closeModal={closeDeleteModal}
                                        data={project}></DeleteProjectModal>
                    <EditProjectModal showModal={showEditModal}
                                      closeModal={closeEditModal}
                                      initialValues={project}></EditProjectModal>
                    <CardActionArea onClick={openProject} id={"card-open-project-" + project.id}>
                        <Box sx={{p: 2.25}}>
                            <Grid container direction="column">
                                <Grid item>
                                    <Grid container justifyContent="space-between">
                                        <Grid item>
                                            <Avatar
                                                variant="rounded"
                                                id={"open-project-"+project.id}
                                                sx={{
                                                    ...theme.typography.commonAvatar,
                                                    ...theme.typography.largeAvatar,
                                                    backgroundColor: theme.palette.secondary.light,
                                                    color: theme.palette.secondary.dark,
                                                }}
                                                onClick={openProject}
                                            >
                                                <FolderOpen/>
                                            </Avatar>
                                        </Grid>
                                        {user.role === 'admin' ? (
                                        <Grid item>
                                            <Avatar
                                                variant="rounded"
                                                id={"menu-project-card-" + project.id}
                                                sx={{
                                                    ...theme.typography.commonAvatar,
                                                    ...theme.typography.mediumAvatar,
                                                    backgroundColor: theme.palette.secondary[800],
                                                    color: theme.palette.secondary[200],
                                                    zIndex: 1
                                                }}
                                                aria-controls="menu-project-card"
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
                                                    id={"menu-project-" + project.id + "-edit"}
                                                    onMouseDown={event => event.stopPropagation()}
                                                    onClick={event => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        onEditClick(event)
                                                        }
                                                    }
                                                >
                                                    <Edit sx={{mr: 1.75}}/> Edit
                                                </MenuItem>
                                                <MenuItem
                                                    id={"menu-project-" + project.id + "-delete"}
                                                    onMouseDown={event => event.stopPropagation()}
                                                    onClick={event => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        onDeleteClick(event)
                                                        }
                                                    }
                                                    sx={{color: 'red'}}
                                                >
                                                    <DeleteForever sx={{mr: 1.75}}/> Delete
                                                </MenuItem>
                                            </Menu>
                                        </Grid>
                                        ):(
                                            <></>
                                        )}
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
                                <Grid item sx={{mb: 1.25}}>
                                    <Typography
                                        sx={{
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            color: theme.palette.secondary[200]
                                        }}
                                    >
                                        Find all your project items here.
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

ProjectCard.propTypes = {
    isLoading: PropTypes.bool
};

export default ProjectCard; 
