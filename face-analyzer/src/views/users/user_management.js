// project imports
import UserDataGrid from "./UserDataGrid";
import {Button, Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import AddUserModal from "../../ui-component/modals/users/AddUserModal";
import axios from "axios";
import {GET_USERS_API} from "../../endpoints/BackendEndpoints";

// ==============================|| EXPERIMENTS DASHBOARD ||============================== //


const UserManagement = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [userList, setUserList] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(GET_USERS_API);
                const {items} = response.data;

                setUserList(items);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching experiment data:', error.message);
            }
        };

        fetchUsers().then();
    }, []);

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
            <UserDataGrid isLoading={isLoading} userList={userList}/>
        </>
    );
};

export default UserManagement;
