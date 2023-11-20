import React, {useEffect, useState} from 'react';
import {Button, Paper} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import clsx from "clsx";
import DeleteUserModal from "../../ui-component/modals/users/DeleteUserModal";

const placeholderUsers = [
    {
        "id": 1,
        "name": "Short",
        "surname": "Number1",
        "email": "user.number1@domain.com",
        "username": "usernumber1",
        "password": "pass1",
        "contactnumber": "",
        "role": "admin"
    },
    {
        "id": 2,
        "name": "ExtremelyLongFirstName",
        "surname": "Number2",
        "email": "user.number2@domain.com",
        "username": "usernumber2",
        "password": "pass2",
        "contactnumber": "+385910000000",
        "role": "admin"
    },
    {
        "id": 3,
        "name": "Tiny",
        "surname": "OneQuiteLongSurname",
        "email": "user.number3@domain.com",
        "username": "usernumber3",
        "password": "pass3",
        "contactnumber": "",
        "role": "researcher"
    },
    {
        "id": 4,
        "name": "AnotherLongFirstName",
        "surname": "AnotherPrettyLongSurname",
        "email": "user.number4@domain.com",
        "username": "usernumber4",
        "password": "pass4",
        "contactnumber": "+385990000000",
        "role": "researcher"
    },
]

const UserDataGrid = () => {
    const [isLoading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userForDeletion, setUserForDeletion] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                //const response = await axios.get(GET_USERS_API);
                //const {items} = response.data;

                // Filter items where projectId is 1
                //const filteredExperimentList = items.filter((item) => item.projectId === 1);
                //console.log('Experiment List:', filteredExperimentList);

                setUserList(placeholderUsers);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching experiment data:', error.message);
            }
        };

        fetchUsers().then();
    }, []);

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const onClickDeleteUser = (userData) => {
        /*
        TODO: Placeholder for user deletion
        Will need to add API call to delete the user by id
         */
        console.log("User to be deleted:", userData);
        setUserForDeletion(userData);
        openDeleteModal();
    }

    const columns = [
        {field: "id", headerName: "ID", maxWidth: 75, headerAlign: "center", align: "center"},
        {field: "name", headerName: "Name", minWidth: 200, flex: 2},
        {field: "surname", headerName: "Surname", minWidth: 200, flex: 2},
        {field: "role", headerName: "Role", minWidth: 100, headerAlign: "center", align: "center", flex: 1,
            cellClassName: (params) => {
                if(params.row.role == null){
                    return '';
                }

                return clsx('super-app', {
                    admin: params.row.role === 'admin',
                    researcher: params.row.role === 'researcher'
                });
            }},
        {field: "email", headerName: "e-mail", minWidth: 250, flex: 2},
        {field: "contactnumber", headerName: "Contact #", minWidth: 150, flex: 1},
        {field: "username", headerName: "Username", minWidth: 150, flex: 2},
        //{field: "password", headerName: "Column 2", width: 150},
        {field: "actions", headerName: "Actions", minWidth: 100, flex: 2, renderCell: (params) => {
                return (
                    <Button onClick={() => onClickDeleteUser(params.row)} variant="contained">
                        Delete
                    </Button>
                );
            }}
    ]

    return (
        <>
            <DeleteUserModal closeModal={closeDeleteModal}
                             showModal={showDeleteModal}
                             userForDeletion={userForDeletion}/>
            <Paper variant={"outlined"}
                   sx={{
                       '& .super-app.admin': {
                           color: 'rgb(217,43,43)',
                           fontWeight: 'bold'
                       },
                       '& .super-app.researcher': {
                           color: 'rgb(82,210,20)',
                           fontWeight: 'bold'
                       }
                   }}
            >
                <DataGrid rows={userList} columns={columns} loading={isLoading} slots={{loadingOverlay: LinearProgress}} />
            </Paper>
        </>
    );
}

export default UserDataGrid