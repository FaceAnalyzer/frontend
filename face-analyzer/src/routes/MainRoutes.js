import {lazy} from 'react';

// project imports
import MainLayout from 'layout/MainLayout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Notes from "../views/experiments/notes/Notes";

const Dashboard = Loadable(lazy(() => import('views/dashboard/Dashboard')));
const Projects = Loadable(lazy(() => import('views/projects/Projects')));
const Experiments = Loadable(lazy(() => import('views/projects/Experiments')));
const ProjectResearchers = Loadable(lazy(() => import('views/projects/researchers/ProjectResearchers')));

// User management
const UserManagement = Loadable(lazy(() => import('views/users/UserManagement')));

const Experiment  = Loadable(lazy(() => import('views/experiments/Experiment')));
const Stimuli = Loadable(lazy(() => import('views/stimuli/Stimuli')));
const Stats = Loadable(lazy(() => import('views/stimuli/charts/Stats')));
const CollectiveStatistics = Loadable(lazy(() => import("views/stimuli/collective/CollectiveStatistics")));

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
      path: 'stimuli/:stimuliId/statistics',
      element: <CollectiveStatistics/>
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
