import {useEffect, useState} from 'react';

// material-ui
import {Paper} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';

// project imports
import LinearProgress from "@mui/material/LinearProgress";

// ==============================|| EXPERIMENTS DASHBOARD ||============================== //

const UserManagement = () => {
    const [isLoading, setLoading] = useState(true);
    const [, setUserList] = useState([]);

    const users = [
        {
            "id": 1,
            "name": "User",
            "surname": "Number1",
            "email": "user.number1@domain.com",
            "username": "usernumber1",
            "password": "pass1",
            "contactnumber": "",
            "role": "admin"
        },
        {
            "id": 2,
            "name": "User",
            "surname": "Number2",
            "email": "user.number2@domain.com",
            "username": "usernumber2",
            "password": "pass2",
            "contactnumber": "+385910000000",
            "role": "admin"
        },
        {
            "id": 3,
            "name": "User",
            "surname": "Number3",
            "email": "user.number3@domain.com",
            "username": "usernumber3",
            "password": "pass3",
            "contactnumber": "",
            "role": "researcher"
        },
        {
            "id": 4,
            "name": "User",
            "surname": "Number4",
            "email": "user.number4@domain.com",
            "username": "usernumber4",
            "password": "pass4",
            "contactnumber": "+385990000000",
            "role": "researcher"
        },
    ]

    const rows = [
        {id: 1, colaaa: "Hello", col2: "World"},
        {id: 2, colaaa: "Mamma", col2: "Mia"}
    ]

    const columns = [
        {field: "id", headerName: "ID", width: 150},
        {field: "name", headerName: "Name", width: 150},
        {field: "surname", headerName: "Surname", width: 150},
        {field: "role", headerName: "Role", width: 150},
        {field: "email", headerName: "e-mail", width: 150},
        {field: "contactnumber", headerName: "Contact #", width: 150},
        {field: "username", headerName: "Username", width: 150},
        //{field: "password", headerName: "Column 2", width: 150},
    ]

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                //const response = await axios.get(GET_USERS_API);
                //const {items} = response.data;

                // Filter items where projectId is 1
                //const filteredExperimentList = items.filter((item) => item.projectId === 1);
                //console.log('Experiment List:', filteredExperimentList);

                setUserList(users);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching experiment data:', error.message);
            }
        };

        fetchUsers();
    }, [users]);


    return (
        <Paper>
            <DataGrid rows={users} columns={columns} slots={{loadingOverlay: LinearProgress}} loading={isLoading} />
        </Paper>
    );
};

export default UserManagement;
