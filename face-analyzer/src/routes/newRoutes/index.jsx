import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useAuth } from "../../context/authProvider";

import MainLayout from '../../layout/MainLayout';
import MinimalLayout from '../../layout/MinimalLayout';

import Login from '../../views/pages/authentication/authentication3/Login3';
import Register from '../../views/pages/authentication/authentication3/Register3';
import { ProtectedRoute } from './ProtectedRoute';


const NewRoutes = () => {
  const { token } = useAuth();

  const routesForNotAuthenticated = {
    path: '/',
    element: <MinimalLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/',
        element: <h1>Home</h1>
,      }
    ]
  };

  const routesForAuthenticated = {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: <h1>Home</h1>
          },
          {
            path: '/dashboard',
            element: <h1>Dashboard</h1>
          },
          {
            path: '/profile',
            element: <h1>Profile</h1>
          }
        ]
      }
    ]
  };

  const router = createBrowserRouter({
    ...(token ? routesForAuthenticated : routesForNotAuthenticated),
  });

  return <RouterProvider router={router} />;
};

export default NewRoutes;