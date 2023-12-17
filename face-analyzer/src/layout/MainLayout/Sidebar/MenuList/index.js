// material-ui
import {Typography} from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import {IconBuildingFactory2, IconFlask, IconUser} from "@tabler/icons";
import axios from "axios";
import {GET_EXPERIMENTS_API, GET_PROJECTS_API} from "../../../../endpoints/BackendEndpoints";
import {FolderOpen} from "@mui/icons-material";
import {useAuth} from "../../../../context/authContext";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {

  const {user} = useAuth();

  if (!user) {
    return <></>;
  }

  const projects = {
    id: 'projectManagement',
    title: 'Project Management',
    type: 'group',
    children: [
      {
        id: 'projects',
        title: 'Projects',
        type: 'collapse',
        url: '/projects',
        icon: IconBuildingFactory2,
        breadcrumbs: false,
        children: []
      }
    ]
  };

  const userManagement = {
    id: 'user_management',
    title: 'User Management',
    type: 'group',
    children: [
      {
        id: 'users',
        title: 'Users',
        type: 'item',
        url: '/users',
        icon: IconUser,
        breadcrumbs: false
      }
    ]
  };

  const getProjects = async () => {
    try {
      const response = await axios.get(GET_PROJECTS_API);
      const {items} = response.data;
      return items;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  };

  const getExperiments = async (projectId) => {
    try {
      const response = await axios.get(GET_EXPERIMENTS_API, {
        params: {
          projectId: projectId
        }
      });
      const {items} = response.data;
      return items;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  };

  const updateProjects = async () => {
    const fetchedProjects = await getProjects();

    projects.children[0].children = await Promise.all(
        fetchedProjects.map(async (project) => {
          const experiments = await getExperiments(project.id);

          return {
            id: `project-${project.id}`,
            title: project.name,
            type: 'collapse',
            icon: FolderOpen,
            url: `/project/${project.id}`,
            breadcrumbs: false,
            children: experiments.map((experiment) => ({
              id: `experiment-${experiment.id}`,
              title: experiment.name,
              type: 'item',
              url: `/experiment/${experiment.id}`,
              icon: IconFlask,
              breadcrumbs: false,
            })),
          };
        })
    );
  };

  updateProjects().then();

  const menuItems = {items: []}

  if (user.role === "Admin") {
    menuItems.items.push(userManagement);
  }

  menuItems.items.push(projects);



  const navItems = menuItems.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
