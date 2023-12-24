import PropTypes from 'prop-types';
import {useState} from 'react';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {Avatar, Box, CardActionArea, Grid, Menu, MenuItem, Tooltip, Typography} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {DeleteForever, Edit} from '@mui/icons-material';
import {IconFlask} from '@tabler/icons';
import {useNavigate} from "react-router-dom";
import DeleteExperimentModal from "../../modals/projects/DeleteExperimentModal";
import EditExperimentModal from "../../modals/projects/EditExperimentModal";

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative'
}));

// ===========================|| EXPERIMENT CARD ||=========================== //

const ExperimentCard = ({isLoading, data}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const experiment = data;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openExperiment = () => {
    navigate('/experiment/' + experiment.id);
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
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <DeleteExperimentModal showModal={showDeleteModal}
                                 closeModal={closeDeleteModal}
                                 data={experiment}></DeleteExperimentModal>
          <EditExperimentModal showModal={showEditModal}
                               closeModal={closeEditModal}
                               initialValues={experiment}></EditExperimentModal>
          <CardActionArea onClick={openExperiment} id={"card-open-experiment-" + experiment.id}>
            <Box sx={{ p: 2.25 }}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Avatar
                      variant="rounded"
                      id={"open-card-" + experiment.id + "-options"}
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.palette.secondary.dark,
                      }}
                      onClick={openExperiment}
                  >
                    <IconFlask />
                  </Avatar>
                </Grid>
                <Grid item>
                  <Avatar
                      variant="rounded"
                      id={"menu-experiment-card-" + experiment.id}
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        backgroundColor: theme.palette.secondary[800],
                        color: theme.palette.secondary[200],
                        zIndex: 1
                      }}
                      aria-controls="menu-experiment-card"
                      aria-haspopup="true"
                      onMouseDown={event => event.stopPropagation()}
                      onClick={event => {
                        event.stopPropagation();
                        event.preventDefault();
                        handleClick(event)
                      }
                      }
                  >
                    <MoreHorizIcon fontSize="inherit" />
                  </Avatar>
                  <Menu
                      id={"menu-experiment-card-" + experiment.id}
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
                        id={"menu-project-" + experiment.id + "-edit"}
                        onMouseDown={event => event.stopPropagation()}
                        onClick={event => {
                          event.stopPropagation();
                          event.preventDefault();
                          onEditClick(event)
                        }
                        }
                    >
                      <Edit sx={{ mr: 1.75 }} /> Edit
                    </MenuItem>
                    <MenuItem
                        id={"menu-project-" + experiment.id + "-delete"}
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
              </Grid>
              <Tooltip title={experiment.name} enterDelay={500} placement={'top'}>
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
                  {experiment.name}
                </Typography>
              </Tooltip>
              <Tooltip title={experiment.description} enterDelay={500}>
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
                  {experiment.description}
                </Typography>
              </Tooltip>
            </Box>
          </CardActionArea>
        </CardWrapper>
      )}
    </>
  );
};

ExperimentCard.propTypes = {
  isLoading: PropTypes.bool
};

export default ExperimentCard;
