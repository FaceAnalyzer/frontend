// project imports
import UserDataGrid from "./UserDataGrid";
import {Button, Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import AddUserModal from "../../ui-component/modals/users/AddUserModal";
import axios from "axios";
import {GET_USERS_API} from "../../endpoints/BackendEndpoints";
import UserManagementHeader from "../../ui-component/headers/UserManagementHeader";
import {useAuth} from "../../context/authContext";
import {useNavigate} from "react-router-dom";

// ==============================|| USER MANAGEMENT DASHBOARD ||============================== //


const UserManagement = () => {
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [userList, setUserList] = useState([]);
    const [existingEmails, setExistingEmails] = useState([]);
    const [existingUsernames, setExistingUsernames] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const {user} = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(GET_USERS_API);
                const {items} = response.data;

                setUserList(items);
                const emails = items.map(item => item.email);
                const usernames = items.map(item => item.username);
                setExistingEmails(emails);
                setExistingUsernames(usernames);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        if (user) {
            if (user.role !== "Admin") {
                navigate("/");
            } else {
                fetchUsers().then();
            }
        } else {
            navigate('/login');
        }

    }, [user, navigate]);

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
    };

    return (!user) ? (<></>) : (
        (user.role !== "Admin") ? (<></>) : (
            <>
                <AddUserModal showModal={showAddModal}
                              closeModal={closeAddModal}
                              existingEmails={existingEmails}
                              existingUsernames={existingUsernames}/>
                <Grid container sx={{mb: 2}}>
                    <Grid item xs={12}>
                        <UserManagementHeader/>
                    </Grid>
                    <Grid item xs={8} sm={6} md={4} lg={2} xl={1}>
                        <Button id={"button-add-user"} onClick={openAddModal} variant="contained" disableElevation>
                            Add user
                        </Button>
                    </Grid>
                </Grid>
                <UserDataGrid
                    isLoading={isLoading}
                    userList={userList}
                    existingUsernames={existingUsernames}
                    existingEmails={existingEmails}
                />
            </>
        ));
};

export default UserManagement;
