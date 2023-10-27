// assets
import { IconFlask } from '@tabler/icons';

// ==============================|| PROJECT MENU ITEMS ||============================== //

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
      icon: IconFlask,
      breadcrumbs: false
    }
  ]
};

export default projects;
