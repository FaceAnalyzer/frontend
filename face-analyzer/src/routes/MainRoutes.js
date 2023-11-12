import {lazy} from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/projects/experiments')));

// analyzer routing
const Analyzer = Loadable(lazy(() => import('views/Analyzer')));

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

const Experiment  = Loadable(lazy(() => import('views/experiment')));
const Stimuli = Loadable(lazy(() => import('views/stimuli')));
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
          element: <Main />
        }
      ]
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
      path: 'experiment/recordReaction',
      element: <Analyzer />
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'tabler-icons',
          element: <UtilsTablerIcons />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'material-icons',
          element: <UtilsMaterialIcons />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
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
      path: 'experiment/edit',
      element: <Edit />
    }
  ]
};

export default MainRoutes;
