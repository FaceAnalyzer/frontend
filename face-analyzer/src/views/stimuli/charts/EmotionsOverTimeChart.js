import {Grid, Typography} from "@mui/material";
import Chart from "react-apexcharts";
import React from "react";

// ==============================|| EMOTIONS OVER TIME CHART ||============================== //

const EmotionsOverTimeChart = ({lineChartData}) => {
    console.log("ed", lineChartData);

    if(!lineChartData){
        return null;
    }

    return(
        <>
            {lineChartData.map((dataEntry, index) => (
                <Grid container key={index} alignItems="center" marginBottom={1}>
                    <Grid item lg={2} md={3} sm={3} xs={12}>
                        <Typography variant="subtitle1" marginRight={2}>
                            {dataEntry.options.tooltip.y.title}
                        </Typography>
                    </Grid>
                    <Grid item lg={10} md={9} sm={9} xs={12}>
                        <Chart {...dataEntry} />
                    </Grid>
                </Grid>
            ))}
        </>

    );

};

export default EmotionsOverTimeChart;