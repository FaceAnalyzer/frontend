import React, {useState} from 'react';
import {Button, Paper} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import clsx from "clsx";
import RemoveUserFromProjectModal from "../../../ui-component/modals/projects/researchers/RemoveUserFromProjectModal";
import AnimateButton from "../../../ui-component/extended/AnimateButton";
import {PersonRemove} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import PropTypes from "prop-types";
import Skeleton from "@mui/material/Skeleton";

const ResearcherDataGrid = ({isLoading, userList, projectData}) => {
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [userForRemoval, setUserForRemoval] = useState({});
    const theme = useTheme();

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
        {field: "id", headerName: "ID", maxWidth: 50, headerAlign: "center", align: "center"},
        {field: "name", headerName: "Name", minWidth: 175, flex: 2},
        {field: "surname", headerName: "Surname", minWidth: 175, flex: 2},
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
                    <AnimateButton>
                        <Button
                            id={"button-remove-researcher-" + params.row.id}
                            onClick={() => onClickRemoveUser(params.row)}
                            sx={{
                                color: theme.palette.grey[700],
                                backgroundColor: theme.palette.grey[50],
                                border: 'solid 1px',
                                borderColor: theme.palette.grey[700]
                            }}
                        >
                            <PersonRemove/>
                        </Button>
                    </AnimateButton>
                );
            }
        }
    ]

    const skeletonRows = Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} height={50} animation="wave" />
    ));

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
                {isLoading ? (
                    skeletonRows
                ) : (
                    <DataGrid rows={userList} columns={columns} loading={isLoading} />
                )}
            </Paper>
        </>
    );
}

ResearcherDataGrid.propTypes = {
    isLoading: PropTypes.bool,
    userList: PropTypes.array,
    projectData: PropTypes.object
};

export default ResearcherDataGrid;