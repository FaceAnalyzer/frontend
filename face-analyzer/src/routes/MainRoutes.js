import {lazy} from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

const Analyzer = Loadable(lazy(() => import('views/reactions')));
const Projects = Loadable(lazy(() => import('views/projects/projects')));
const Experiments = Loadable(lazy(() => import('views/projects/experiments')));

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
      element: <Projects/>
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
      path: 'experiment/:experimentId',
      element: <Experiment />
    },
    {
      path: 'stimuli/:stimuliId',
      element: <Stimuli/>
    },
    {
      path: 'reaction/:reactionId',
      element: <Analyzer />
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
