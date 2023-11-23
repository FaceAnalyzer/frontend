import { useRoutes } from 'react-router-dom';

// routes
// import Routes from './newRoutes';
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, AuthenticationRoutes]);
}
