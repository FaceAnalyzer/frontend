import React, {useState} from 'react';
import {Button, Paper} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import clsx from "clsx";
import RemoveUserFromProjectModal from "../../../ui-component/modals/projects/researchers/RemoveUserFromProjectModal";

const UserDataGrid = ({isLoading, userList, projectData}) => {
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [userForRemoval, setUserForRemoval] = useState({});

    const openRemoveModal = () => {
        setShowRemoveModal(true);
    };

    const closeRemoveModal = () => {
        setShowRemoveModal(false);
    };

    const onClickRemoveUser = (userData) => {
        setUserForRemoval(userData);
        openRemoveModal();
    }

    const columns = [
        {field: "id", headerName: "ID", maxWidth: 75, headerAlign: "center", align: "center"},
        {field: "name", headerName: "Name", minWidth: 200, flex: 2},
        {field: "surname", headerName: "Surname", minWidth: 200, flex: 2},
        {
            field: "role", headerName: "Role", minWidth: 100, headerAlign: "center", align: "center", flex: 1,
            cellClassName: (params) => {
                if (params.row.role == null) {
                    return '';
                }

                return clsx('super-app', {
                    admin: params.row.role === 'Admin',
                    researcher: params.row.role === 'Researcher'
                });
            }
        },
        {field: "email", headerName: "e-mail", minWidth: 250, flex: 2},
        {field: "contactNumber", headerName: "Contact #", minWidth: 150, flex: 1},
        {field: "username", headerName: "Username", minWidth: 150, flex: 2},
        //{field: "password", headerName: "Column 2", width: 150},
        {
            field: "actions", headerName: "Actions", minWidth: 100, flex: 2, renderCell: (params) => {
                return (
                    <Button onClick={() => onClickRemoveUser(params.row)} variant="contained" disableElevation>
                        Remove
                    </Button>
                );
            }
        }
    ]

    return (
        <>
            <RemoveUserFromProjectModal closeModal={closeRemoveModal}
                                        showModal={showRemoveModal}
                                        userForRemoval={userForRemoval}
                                        projectData={projectData}/>
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
                <DataGrid rows={userList} columns={columns} loading={isLoading}
                          slots={{loadingOverlay: LinearProgress}}/>
            </Paper>
        </>
    );
}

export default UserDataGrid;