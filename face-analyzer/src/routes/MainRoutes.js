import {lazy} from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Notes from "../views/experiments/notes";

const Dashboard = Loadable(lazy(() => import('views/dashboard')));
const Projects = Loadable(lazy(() => import('views/projects/projects')));
const Experiments = Loadable(lazy(() => import('views/projects/experiments')));
const ProjectResearchers = Loadable(lazy(() => import('views/projects/researchers')));

// User management
const UserManagement = Loadable(lazy(() => import('views/users/user_management')));

const Experiment  = Loadable(lazy(() => import('views/experiments')));
const Stimuli = Loadable(lazy(() => import('views/stimuli')));
const Stats = Loadable(lazy(() => import('views/stimuli/charts')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Dashboard/>
    },
    {
      path: 'projects',
      element: <Projects/>
    },
    {
      path: 'project/:projectId',
      element: <Experiments/>
    },
    {
      path: 'project/:projectId/researchers',
      element: <ProjectResearchers/>
    },
    {
      path: 'experiment/:experimentId',
      element: <Experiment />
    },
    {
      path: 'experiment/:experimentId/notes',
      element: <Notes/>
    },
    {
      path: 'stimuli/:stimuliId',
      element: <Stimuli/>
    },
    {
      path: 'reaction/:reactionId/statistics',
      element: <Stats/>
    },
    {
      path: 'users',
      element: <UserManagement />
    }
  ]
};

export default MainRoutes;
