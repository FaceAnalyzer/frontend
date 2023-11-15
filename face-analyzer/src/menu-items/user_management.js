// assets
import { IconUser } from '@tabler/icons';

// ==============================|| USER MANAGEMENT ||============================== //

const user_management = {
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
            breadcrumbs: true
        }
    ]
};

export default user_management;
