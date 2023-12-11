// assets

// ==============================|| PROJECT MENU ITEMS ||============================== //

import {FolderOpen} from "@mui/icons-material";

const projects = {
  id: 'projects',
  title: 'Project Management',
  type: 'group',
  children: [
    {
      id: 'project_A',
      title: 'Project A',
      type: 'item',
      url: '/projects/experiments',
      icon: FolderOpen,
      breadcrumbs: false
    }
  ]
};

export default projects;
