import {lazy} from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/projects/experiments')));

// analyzer routing
const Analyzer = Loadable(lazy(() => import('views/reactions')));

// 13 - user creates experiments routing
const Experiments = Loadable(lazy(() => import('views/projects/experiments')));

const Experiment  = Loadable(lazy(() => import('views/experiments')));
const Stimuli = Loadable(lazy(() => import('views/stimuli')));
const Stats = Loadable(lazy(() => import('views/stimuli/charts')));
const Edit = Loadable(lazy(() => import('views/experiments/edit')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Experiments />
    },
    {
      path: 'projects',
      children: [
        {
          path: 'experiments',
          element: <Experiments />
        }
      ]
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
      path: 'reaction',
      children: [
        {
          path: ':reactionId/statistics',
          element: <Stats/>
        },
      ]
    }
  ]
};

export default MainRoutes;
