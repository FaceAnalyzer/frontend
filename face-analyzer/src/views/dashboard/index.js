import React, {useEffect, useState} from 'react';

// material-ui
import {Grid} from '@mui/material';
import DashboardHeader from "../../ui-component/headers/DashboardHeader";
import DashboardCard from "../../ui-component/cards/dashboard/DashboardCard";
import {useAuth} from "../../context/authContext";
import {Navigate} from "react-router";

// ==============================|| LANDING DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const {user} = useAuth();

    useEffect(() => {
        setLoading(false);
    }, [isLoading]);

    return (
        <Grid container spacing={3}>
            {!user ? (<Navigate to="/login" replace/>) : (
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
            )}
        </Grid>
    );

};

export default Dashboard;
