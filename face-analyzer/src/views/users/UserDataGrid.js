import React, {useState} from 'react';
import {Button, Paper} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import clsx from "clsx";
import DeleteUserModal from "../../ui-component/modals/users/DeleteUserModal";
import EditUserModal from "../../ui-component/modals/users/EditUserModal";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import {IconEdit, IconTrashOff} from "@tabler/icons";
import {useTheme} from "@mui/material/styles";

const UserDataGrid = ({isLoading, userList, existingEmails, existingUsernames}) => {
    const theme = useTheme();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userForDeletion, setUserForDeletion] = useState({});

    const [showEditModal, setShowEditModal] = useState(false);
    const [userForEdit, setUserForEdit] = useState({});

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const openEditModal = () => {
        setShowEditModal(true);
    };
    const closeEditModal = () => {
        setShowEditModal(false);
    };

    const onClickDeleteUser = (userData) => {
        setUserForDeletion(userData);
        openDeleteModal();
    }

    const onClickEditUser = (userData) => {
        setUserForEdit(userData);
        openEditModal();
    }

    const columns = [
        {field: "id", headerName: "ID", maxWidth: 50, headerAlign: "center", align: "center"},
        {field: "name", headerName: "Name", minWidth: 175, flex: 2},
        {field: "surname", headerName: "Surname", minWidth: 175, flex: 2},
        {field: "role", headerName: "Role", minWidth: 100, headerAlign: "center", align: "center", flex: 1,
            cellClassName: (params) => {
                if(params.row.role == null){
                    return '';
                }

                return clsx('super-app', {
                    admin: params.row.role === 'Admin',
                    researcher: params.row.role === 'Researcher'
                });
            }},
        {field: "email", headerName: "e-mail", minWidth: 250, flex: 2},
        {field: "contactNumber", headerName: "Contact #", minWidth: 150, flex: 1},
        {field: "username", headerName: "Username", minWidth: 150, flex: 2},
        //{field: "password", headerName: "Column 2", width: 150},
        {field: "actions", headerName: "Actions", minWidth: 150, headerAlign: "center", align: "center", flex: 2, renderCell: (params) => {
                return (
                    <>
                        <AnimateButton>
                            <Button
                                id={"button-edit-user-" + params.row.id}
                                disableElevation
                                onClick={() => onClickEditUser(params.row)}
                                variant="contained"
                                color="secondary"
                                width="min-content"
                            >
                                <IconEdit/>
                            </Button>
                        </AnimateButton>
                        &nbsp;
                        <AnimateButton>
                            <Button
                                id={"button-delete-user-" + params.row.id}
                                onClick={() => onClickDeleteUser(params.row)}
                                sx={{
                                    color: theme.palette.grey[700],
                                    backgroundColor: theme.palette.grey[50],
                                }}
                            >
                                <IconTrashOff/>
                            </Button>
                        </AnimateButton>
                    </>
                );
            }}
    ]

    return (
        <>
            <DeleteUserModal closeModal={closeDeleteModal}
                             showModal={showDeleteModal}
                             userForDeletion={userForDeletion}/>
            <EditUserModal closeModal={closeEditModal}
                           showModal={showEditModal}
                           userForEdit={userForEdit}
                           existingEmails={existingEmails}
                           existingUsernames={existingUsernames}
            />
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