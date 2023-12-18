import React, { useState, useEffect } from "react";
import { Grid, Checkbox, FormControlLabel } from "@mui/material";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { format, addMilliseconds } from "date-fns";

const NewChart = ({ groupedSortedData, videoPercentage }) => {
    const [chartData, setChartData] = useState([]);
    const [referenceLineX, setReferenceLineX] = useState(0);
    const [selectedLines, setSelectedLines] = useState(() =>
        Object.keys(groupedSortedData).reduce((acc, emotion) => {
            acc[emotion] = true; // Initially, all lines are selected
            return acc;
        }, {})
    );

    const emotionColor = {
        Anger: "#ff0000",
        Disgust: "#ffa500",
        Fear: "#800080",
        Happiness: "#00ff00",
        Sadness: "#0000ff",
        Surprise: "#ffff00",
        Neutral: "#000",
    };

    const createChartData = (groupedData) => {
        const data = Object.keys(groupedData[Object.keys(groupedData)[0]]).map(
            (dataPointIndex) => {
                const timeOffset =
                    groupedData[Object.keys(groupedData)[0]][dataPointIndex]["timeOffset"];
                return {
                    timeOffset,
                    ...Object.keys(groupedData).reduce((acc, emotion) => {
                        acc[emotion] = groupedData[emotion][dataPointIndex].value;
                        return acc;
                    }, {}),
                };
            }
        );
        return data;
    };

    useEffect(() => {
        if (groupedSortedData.length !== 0) {
            const chartData = createChartData(groupedSortedData);
            setChartData(chartData);

            setSelectedLines((prevSelectedLines) => {
                const emotionsFromData = Object.keys(groupedSortedData);
                const updatedSelectedLines = {};

                emotionsFromData.forEach((emotion) => {
                    updatedSelectedLines[emotion] = prevSelectedLines[emotion] ?? true;
                });

                return updatedSelectedLines;
            });
        }
    }, [groupedSortedData]);

    const timeFormat = "mm:ss";

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={tooltipStyle}>
                    <p style={{color: '#fff'}}>{`Time (mm:ss): ${format(
                        addMilliseconds(new Date(0), label),
                        timeFormat
                    )}`}</p>
                    {payload.map(
                        (entry) =>
                            selectedLines[entry.dataKey] && (
                                <p key={`emotion-${entry.dataKey}`} style={{ color: entry.color, margin: 0 }}>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "10px", // Adjust the width of the colored box or circle
                                            height: "10px", // Adjust the height of the colored box or circle
                                            borderRadius: "50%",
                                            backgroundColor: entry.color,
                                            marginRight: "5px", // Adjust the spacing between the box and text
                                        }}
                                    />
                                    <span style={{color: '#fff'}}>
                                        {`${entry.dataKey}: ${entry.value.toFixed(4)}`}
                                    </span>
                                </p>
                            )
                    )}
                </div>
            );
        }

        return null;
    };

    const handleLineToggle = (emotion) => {
        setSelectedLines((prevSelectedLines) => ({
            ...prevSelectedLines,
            [emotion]: !prevSelectedLines[emotion],
        }));
    };

    useEffect(() => {
        // Calculate the minimum and maximum timeOffset values
        const minTimeOffset = Math.min(...chartData.map((entry) => entry.timeOffset));
        const maxTimeOffset = Math.max(...chartData.map((entry) => entry.timeOffset));

        // Calculate the ReferenceLine x value
        setReferenceLineX(videoPercentage * (maxTimeOffset - minTimeOffset) + minTimeOffset);

        // Log the values
        console.log("ReferenceLine x value:", videoPercentage * (maxTimeOffset - minTimeOffset) + minTimeOffset);
        console.log("Minimum timeOffset:", minTimeOffset);
        console.log("Maximum timeOffset:", maxTimeOffset);
    }, [videoPercentage, chartData]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <div>
                        {Object.keys(groupedSortedData).map((emotion) => (
                            <FormControlLabel
                                key={emotion}
                                control={
                                    <Checkbox
                                        defaultChecked={true}
                                        onChange={() => handleLineToggle(emotion)}
                                    />
                                }
                                label={emotion}
                            />
                        ))}
                    </div>
                    <ResponsiveContainer height={600}>
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis
                                dataKey="timeOffset"
                                type="number"
                                domain={[
                                    Math.min(...chartData.map((entry) => entry.timeOffset)),
                                    Math.max(...chartData.map((entry) => entry.timeOffset)),
                                ]}
                                ticks={chartData.map((entry) => entry.timeOffset)}
                                label={{ value: "Video time in ms", position: "bottom" }}
                            >
                                {videoPercentage && (
                                    <ReferenceLine
                                        x={referenceLineX}
                                        stroke={"red"}
                                        label={{value: "Video Time", position: "insideTopRight"}}
                                    />
                                )}
                            </XAxis>
                            <YAxis
                                type="number"
                                domain={[0.0, 1.0]}
                                label={{ value: "Emotion level", angle: -90, position: "left" }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {Object.keys(groupedSortedData).map((emotion) => (
                                selectedLines[emotion] && (
                                    <Line
                                        key={emotion}
                                        type="linear"
                                        dataKey={emotion}
                                        stroke={emotionColor[emotion]}
                                        dot={false}
                                    />
                                )
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </Grid>
            </Grid>
        </>
    );
};

const tooltipStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    border: "1px solid #ccc",
    padding: "0px 10px 10px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

export default NewChart;
