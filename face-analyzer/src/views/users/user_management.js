// project imports
import UserDataGrid from "./UserDataGrid";
import {Button, Grid} from "@mui/material";
import React, {useState} from "react";
import AddUserModal from "../../ui-component/modals/users/AddUserModal";

// ==============================|| EXPERIMENTS DASHBOARD ||============================== //


const UserManagement = () => {
    const [showAddModal, setShowAddModal] = useState(false);

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
    };

    return (
        <>
            <AddUserModal showModal={showAddModal} closeModal={closeAddModal}/>
            <Grid container sx={{mb: 2}}>
                <Grid item xs={8} sm={6} md={4} lg={2} xl={1}>
                    <Button onClick={openAddModal} variant="contained" disableElevation>
                        Add user
                    </Button>
                </Grid>
            </Grid>
            <UserDataGrid/>
        </>
    );
};

export default UserManagement;
