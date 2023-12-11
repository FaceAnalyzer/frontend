import {useEffect, useRef, useState} from 'react';

import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

// material-ui
import {useTheme} from '@mui/material/styles';
import {
    Avatar,
    Box,
    Chip,
    ClickAwayListener,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Stack,
    Typography
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import ResearcherIcon from 'assets/images/users/researcher.png';
import AdminIcon from 'assets/images/users/admin.png';
import AnonIcon from 'assets/images/users/anonymous.png';

// assets
import {IconLogout, IconSettings} from '@tabler/icons';

import {useAuth} from 'context/authContext';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const anchorRef = useRef(null);

  const {user, setToken, setUser} = useAuth();

  const handleLogout = async () => {
    setToken();
    setUser();
    console.log('Logout');
    console.log(`localStorage length: ${localStorage.length}`);
      navigate('/login');
  };

  const handleLogin = async () => {
      navigate('/login');
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

    const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
              src={user ? ((user.role === "Admin") ? AdminIcon : ResearcherIcon) : AnonIcon}
            sx={{
                ...theme.typography.mediumAvatar,
                margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box sx={{paddingLeft: 2, paddingRight: 2, paddingTop: 2}}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography variant="h4" sx={{fontWeight: 400}}>Hello,</Typography>
                          <Typography component="span" variant="h4">
                          {user ? user.name + " " + user.surname : "Anonymous"}
                        </Typography>
                      </Stack>
                        <Typography sx={{paddingTop: 1, paddingBottom: 1}}
                                    variant="subtitle2">{user ? user.role : ""}</Typography>
                    </Stack>
                    <Divider />
                  </Box>
                  {/*<PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>*/}
                    <Box>
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          //selected={selectedIndex === 4}
                          onClick={user ? handleLogout : handleLogin}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">{user ? "Logout" : "Login"}</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  {/*</PerfectScrollbar>*/}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
