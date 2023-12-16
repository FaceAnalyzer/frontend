import React, {useEffect, useState} from 'react';

// material-ui
import {Grid} from '@mui/material';
import DashboardHeader from "../../ui-component/headers/DashboardHeader";
import DashboardCard from "../../ui-component/cards/DashboardCard";

// ==============================|| LANDING DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [isLoading]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <DashboardHeader/>
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
                <DashboardCard isLoading={isLoading} component={"Projects"}/>
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
                <DashboardCard isLoading={isLoading} component={"Users"}/>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
