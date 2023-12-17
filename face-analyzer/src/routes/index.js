import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';

import axios from 'axios';

//Set default Auth headers if a token exists
(function() {
  const token = localStorage.getItem("token");
  if(token){
    axios.defaults.headers.common['Authorization'] = "Bearer " + token;
  }
  else {
    delete axios.defaults.headers.common['Authorization'];
  }
})()

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, AuthenticationRoutes]);
}
