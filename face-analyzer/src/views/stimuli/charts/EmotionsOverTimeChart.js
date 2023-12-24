import { Grid } from "@mui/material";
import React from "react";
import Skeleton from "@mui/material/Skeleton";
import NewChart from "./NewChart";

// ==============================|| EMOTIONS OVER TIME CHART ||============================== //

const EmotionsOverTimeChart = ({ isLoading, groupedSortedData }) => {

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {isLoading ? (
                        <Skeleton animation={"wave"}>
                            <NewChart groupedSortedData={groupedSortedData} />
                        </Skeleton>
                            ) : (
                        <NewChart groupedSortedData={groupedSortedData} />
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default EmotionsOverTimeChart;
