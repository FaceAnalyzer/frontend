import React, {useEffect, useState} from "react";
import {Checkbox, FormControlLabel, Grid} from "@mui/material";
import {Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts";
import {addMilliseconds, format} from "date-fns";
import PropTypes from "prop-types";

const NewChart = ({ groupedSortedData, videoTimeMs, setTimestamp }) => {
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
        Disgust: "#00a0a0",
        Fear: "#800080",
        Happiness: "#ffcc00",
        Sadness: "#3399ff",
        Surprise: "#cc66ff",
        Neutral: "#000",
    };

    const formatMilliseconds = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

        return `${formattedMinutes}:${formattedSeconds}`;
    }

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
        if (Object.keys(groupedSortedData).length !== 0) {
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

    const handleChartClick = (event) => {
        if(event && event.activePayload && event.activePayload.length > 0) {
            const xValue = event.activePayload[0].payload.timeOffset;
            console.log("xval", xValue);
            setTimestamp(xValue);
        }
    }

    useEffect(() => {
        setReferenceLineX(videoTimeMs);
    }, [videoTimeMs]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <ResponsiveContainer height={600}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                        onClick={handleChartClick}
                    >
                        <ReferenceLine
                            x={referenceLineX}
                            stroke={"grey"}
                            strokeWidth={1.5}
                            strokeDasharray={"5 5"}
                            label={{ value: "Video Time", position: "insideTopRight" }}
                        />
                        <XAxis
                            dataKey="timeOffset"
                            type="number"
                            domain={[
                                Math.min(...chartData.map((entry) => entry.timeOffset)),
                                Math.max(...chartData.map((entry) => entry.timeOffset)),
                            ]}
                            tickFormatter={formatMilliseconds}
                            interval={"preserveStartEnd"}
                            ticks={chartData.map((entry) => entry.timeOffset)}
                            label={{value: "Video time in ms", position: "bottom", offset: 25}}
                            minTickGap={10}
                            //angle={-45}
                        />
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
                                    strokeWidth={2}
                                    dot={false}
                                />
                            )
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </Grid>
            <Grid item xs={12}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {Object.keys(groupedSortedData).map((emotion) => (
                        <FormControlLabel
                            key={emotion}
                            control={
                                <Checkbox
                                    defaultChecked={true}
                                    onChange={() => handleLineToggle(emotion)}
                                    style={{ color: emotionColor[emotion] }}
                                />
                            }
                            label={emotion}
                        />
                    ))}
                </div>
            </Grid>
        </Grid>
    );
};

const tooltipStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    border: "1px solid #ccc",
    padding: "0px 10px 10px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

NewChart.propTypes = {
    groupedSortedData: PropTypes.object,
    videoTimeMs: PropTypes.number,
    active: PropTypes.bool,
    payload: PropTypes.array,
    label: PropTypes.string,
    setTimestamp: PropTypes.number,
};
 
export default NewChart;
