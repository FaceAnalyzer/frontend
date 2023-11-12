import React, {useEffect, useState} from 'react';

// material-ui
import {Grid, Typography} from '@mui/material';

// project imports
import {gridSpacing} from 'store/constant';
import Chart from "react-apexcharts";
import {dummyData} from "./dummy-chart-data";
import ChartHeader from "./ChartHeader";
import BoxPlotChart from "./BoxPlotChart";
import {useParams} from "react-router";

// ==============================|| STATISTICS DASHBOARD ||============================== //

const Stats = () => {
    // const theme = useTheme();
    const {reactionId} = useParams();

    const [isLoading, setLoading] = useState(true);
    console.log(isLoading); //stop lint errors

    const [activeButton, setActiveButton] = useState('overTime');

    useEffect(() => {
        setLoading(false);
    }, [reactionId]);

    return (
        <Grid container spacing={gridSpacing} sx={{padding: '16px'}}>
            <Grid item xs={12}>
                <ChartHeader activeButton={activeButton}
                             setActiveButton={setActiveButton}
                             reactionData={dummyData}/>
            </Grid>
            {activeButton === 'overTime' && (
                <Grid item lg={8} md={12} sm={12} xs={12}>
                    {dummyData.map((dummyDataEntry, index) => (
                        <Grid container key={index} alignItems="center" marginBottom={1}>
                            <Grid item lg={2} md={3} sm={3} xs={12}>
                                <Typography variant="subtitle1" marginRight={2}>
                                    {dummyDataEntry.options.tooltip.y.title}
                                </Typography>
                            </Grid>
                            <Grid item lg={10} md={9} sm={9} xs={12}>
                                <Chart {...dummyDataEntry} />
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            )}
            {activeButton === 'distribution' && (
                <Grid item lg={8} md={12} sm={12} xs={12}>
                    <BoxPlotChart/>
                </Grid>
            )}
        </Grid>
    );
};

export default Stats;
