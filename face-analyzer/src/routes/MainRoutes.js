import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

import ProtectedRoute from './ProtectedRoutes';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/projects/experiments')));

// analyzer routing
const Analyzer = Loadable(lazy(() => import('views/reactions')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// 13 - user creates experiments routing
const Main = Loadable(lazy(() => import('views/dashboard/main')));
const Experiments = Loadable(lazy(() => import('views/projects/experiments')));

const Experiment = Loadable(lazy(() => import('views/experiment')));
const Stimuli = Loadable(lazy(() => import('views/stimuli')));
const Stats = Loadable(lazy(() => import('views/stimuli/charts')));
const Edit = Loadable(lazy(() => import('views/experiment/edit')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        },
        {
          path: 'main',
          element: <ProtectedRoute component={Main} roles={['admin', 'user']} />
        }
      ]
    },
    {
      path: 'projects',
      children: [
        {
          path: 'experiments',
          element: <ProtectedRoute component={Experiments} roles={['admin', 'user']} />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <ProtectedRoute component={UtilsTypography} roles={['admin', 'user']} />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <ProtectedRoute component={UtilsColor} roles={['admin', 'user']} />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <ProtectedRoute component={UtilsShadow} roles={['admin', 'user']} />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'tabler-icons',
          element: <ProtectedRoute component={UtilsTablerIcons} roles={['admin', 'user']} />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'material-icons',
          element: <ProtectedRoute component={UtilsMaterialIcons} roles={['admin', 'user']} />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <ProtectedRoute component={SamplePage} roles={['admin', 'user']} />
    },
    {
      path: 'experiment/:experimentId',
      element: <ProtectedRoute component={Experiment} roles={['admin', 'user']} />
    },
    {
      path: 'stimuli/:stimuliId',
      element: <ProtectedRoute component={Stimuli} roles={['admin', 'user']} />
    },
    {
      path: 'reaction/:reactionId',
      element: <ProtectedRoute component={Analyzer} roles={['admin', 'user']} />
    },
    {
      path: 'reaction/:reactionId/statistics',
      element: <ProtectedRoute component={Stats} roles={['admin', 'user']} />
    },
    {
      path: 'experiment/edit',
      element: <ProtectedRoute component={Edit} roles={['admin', 'user']} />
    }
  ]
};

export default MainRoutes;
