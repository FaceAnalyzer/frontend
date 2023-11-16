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
import DeleteExperimentModal from "../../modals/projects/DeleteExperimentModal";
import EditExperimentModal from "../../modals/experiments/EditExperimentModal";

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative'
}));

// ===========================|| EXPERIMENT CARD ||=========================== //

const ExperimentCard = ({isLoading, data}) => {
  const theme = useTheme();

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
    window.location.href = '/experiment/' + experiment.id;
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
                                 deleteName={experiment.name}
                                 deleteId={experiment.id}></DeleteExperimentModal>
          <EditExperimentModal showModal={showEditModal}
                               closeModal={closeEditModal}
                               initialValues={experiment}></EditExperimentModal>
          <Box sx={{ p: 2.25 }}>
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
                      onClick={openExperiment}
                    >
                      <IconFlask />
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
                      aria-controls="menu-experiment-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <MoreHorizIcon fontSize="inherit" />
                    </Avatar>
                    <Menu
                      id="menu-experiment-card"
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
                        <Download sx={{ mr: 1.75 }} /> Export
                      </MenuItem>
                      <MenuItem onClick={onEditClick}>
                        <Edit sx={{ mr: 1.75 }} /> Edit
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
                        }}>{experiment.name}</Typography>
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
                  {experiment.description}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

ExperimentCard.propTypes = {
  isLoading: PropTypes.bool
};

export default ExperimentCard;
