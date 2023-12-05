import { Grid, Typography } from "@mui/material";
import Chart from "react-apexcharts";
import React, { useEffect, useState } from "react";

// ==============================|| EMOTIONS OVER TIME CHART ||============================== //

const EmotionsOverTimeChart = ({ groupedSortedData }) => {
    const [chartOptions, setChartOptions] = useState({});
    const [seriesData, setSeriesData] = useState([]);

    const emotionColor = {
        Anger: "#ff0000",
        Disgust: "#ffa500",
        Fear: "#800080",
        Happiness: "#00ff00",
        Sadness: "#0000ff",
        Surprise: "#ffff00",
        Neutral: "#000",
    };

    const createChartConfigs = (emotionColor, groupedData) => {
        const options = {
            height: "100%",
            chart: {
                type: "line",
                height: 300,
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
                width: 3,
            },
            xaxis: {
                type: "linear",
                labels: {
                    formatter: function (val) {
                        return val; // Format x-axis labels as needed
                    },
                },
            },
            yaxis: {
                min: 0.0,
                max: 1.0,
                labels: {
                    show: true,
                },
            },
            tooltip: {
                theme: "dark",
                fixed: {
                    enabled: false,
                },
            },
            annotations: {
                strokeDashArray: 0,
                borderColor: "#000",
                borderWidth: 100,
                xaxis: [
                    {
                        x: 0,
                        strokeDashArray: 0,
                    },
                ],
            },
        };

        const series = Object.keys(groupedData).map((emotion) => ({
            name: emotion,
            data: groupedData[emotion].map((item) => ({
                x: item.timeOffset,
                y: item.value,
            })),
        }));

        return { options, series };
    };

    useEffect(() => {
        if (groupedSortedData) {
            const { options, series } = createChartConfigs(
                emotionColor,
                groupedSortedData
            );
            setChartOptions(options);
            setSeriesData(series);
        }
    }, [groupedSortedData]);

    return (
        <>
            <Grid container alignItems="center" marginBottom={1}>
                <Grid item xs={12}>
                    <Chart options={chartOptions} series={seriesData} type="line" height={300} />
                </Grid>
            </Grid>
        </>
    );
};

export default EmotionsOverTimeChart;
