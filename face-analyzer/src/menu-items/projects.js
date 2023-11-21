// assets

// ==============================|| PROJECT MENU ITEMS ||============================== //

import {IconFileAnalytics} from "@tabler/icons";

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
      icon: IconFileAnalytics,
      breadcrumbs: false
    }
  ]
};

export default projects;
