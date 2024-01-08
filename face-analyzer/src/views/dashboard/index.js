import React, {useEffect, useState} from 'react';

// material-ui
import {Grid} from '@mui/material';
import DashboardHeader from "../../ui-component/headers/DashboardHeader";
import DashboardCard from "../../ui-component/cards/dashboard/DashboardCard";
import {useAuth} from "../../context/authContext";
import {useNavigate} from "react-router-dom";

// ==============================|| LANDING DASHBOARD ||============================== //

const Dashboard = () => {
    const navigate = useNavigate();

    const [isLoading, setLoading] = useState(true);
    const {user} = useAuth();

    useEffect(() => {
        if (user) {
            setLoading(false);
        } else {
            navigate('/login');
        }

    }, [isLoading, user, navigate]);

    return !user ? (
        <></>
    ) : (
        <Grid container spacing={3}>

            <>
                    <Grid item xs={12}>
                        <DashboardHeader/>
                    </Grid>
                    {user.role === 'Researcher' ? (
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <DashboardCard isLoading={isLoading} component={'Projects'}/>
                        </Grid>
                    ) : (
                        <>
                            <Grid item lg={4} md={6} sm={6} xs={12}>
                                <DashboardCard isLoading={isLoading} component={'Projects'}/>
                            </Grid>
                            <Grid item lg={4} md={6} sm={6} xs={12}>
                                <DashboardCard isLoading={isLoading} component={'Users'}/>
                            </Grid>
                        </>
                    )}
                </>
        </Grid>
    );

};

export default Dashboard;
