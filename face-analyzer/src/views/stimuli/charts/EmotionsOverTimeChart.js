import { Grid } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Chart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import {format, addMilliseconds} from "date-fns";
import Skeleton from "@mui/material/Skeleton";
import NewChart from "./NewChart";

// ==============================|| EMOTIONS OVER TIME CHART ||============================== //

const EmotionsOverTimeChart = ({ isLoading, groupedSortedData, annotations }) => {
    const [chartOptions, setChartOptions] = useState({});
    const [seriesData, setSeriesData] = useState([]);

    const emotionColor = {
        Anger: "#ff0000",
        Disgust: "#00a0a0",
        Fear: "#800080",
        Happiness: "#ffcc00",
        Sadness: "#3399ff",
        Surprise: "#cc66ff",
        Neutral: "#000",
    };

    const createChartConfigs = (emotionColor, groupedData) => {
        const timeFormat = 'mm:ss';
        const options = {
            chart: {
                id: "emotions-over-time",
                type: "line",
                toolbar: {
                    show: true,
                    tools: {
                        download: false
                    }
                },
                events: {
                    dataPointSelection: (event, chartContext, config) => {
                        console.log("datapoint selection", event, chartContext, config);
                    }
                }
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
                tickAmount: Math.ceil(groupedData["Anger"].length * 0.1),
                labels: {
                    show: true,
                },
                title: {
                    text: "Video time in ms"
                }
            },
            yaxis: {
                min: 0.0,
                max: 1.0,
                decimalsInFloat: 2,
                labels: {
                    show: true,
                },
                title: {
                    text: "Emotion level"
                }
            },
            tooltip: {
                theme: "dark",
                followCursor: false,
                onDatasetHover: {
                    highlightDataSeries: true
                },
                fixed: {
                    enabled: false,
                },
                x: {
                    show: true,
                    formatter: (value, { seriesIndex, dataPointIndex }) => {
                        const timeOffset = Object.values(groupedData)[seriesIndex][dataPointIndex]['timeOffset'];
                        return `Time (mm:ss): ${format(addMilliseconds(new Date(0), timeOffset), timeFormat)}`;
                    },
                },
                y: {
                    formatter: (y) => (y !== undefined ? y.toFixed(4) : ''),
                }
            },
        };

        const series = Object.keys(groupedData).map((emotion) => ({
            name: emotion,
            data: groupedData[emotion].map((item) => ({
                x: item['timeOffset'],
                y: item.value,
            })),
            color: emotionColor[emotion],
        }));

        return { options, series };
    };

    useEffect(() => {
        if (Object.keys(groupedSortedData).length !== 0) {
            const { options, series } = createChartConfigs(
                emotionColor,
                groupedSortedData
            );
            setChartOptions(options);
            setSeriesData(series);
        }
    }, [groupedSortedData]);

    useEffect(() => {
        const percentage = annotations;
        const maxX = groupedSortedData["Anger"] ? groupedSortedData["Anger"].length : 0;
        console.log("res", Math.floor(maxX * percentage));

        /*
        setChartOptions({
            ...chartOptions,
            annotations: {
                borderColor: "#775DD0",
                xaxis: [
                    {
                        x: percentage * maxX * 10,
                        strokeDashArray: 0,
                        label: {
                            style: {
                                color: '#000',
                            },
                            text: 'REEEEEEEEEEEE'
                        }
                    },
                ],
            },
        })*/
    }, [annotations]);

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
