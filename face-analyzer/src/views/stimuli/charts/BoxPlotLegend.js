import {Grid, Link, Typography} from "@mui/material";
import Chart from "react-apexcharts";
import {useTheme} from "@mui/material/styles";
import React from "react";

// ==============================|| BOX PLOT CHART ||============================== //

const BoxPlotLegend = () => {
    const theme = useTheme();

    //TODO: make the legend look a bit better, the width is kinda funky

    return (
        <Grid container spacing={2}>
            {/* Box Plot Column */}
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Chart
                    type="boxPlot"
                    height={"400vh"}
                    width={"100%"}
                    series={[
                        {
                            type: 'boxPlot',
                            data: [{ x: 'Example', y: [0.1, 0.3, 0.55, 0.7, 0.9] }, {x: '', y:[0,0,0,0,0]}],
                        },
                    ]}
                    options={{
                        chart: {
                            type: 'boxPlot',
                            toolbar: {
                                show: false,
                            },
                        },
                        title: {
                            text: 'Legend',
                            align: 'left',
                        },
                        plotOptions: {
                            boxPlot: {
                                colors: {
                                    upper: theme.palette.primary[800],
                                    lower: theme.palette.primary[200],
                                },
                            },
                        },
                        yaxis: {
                            max: 1.0,
                            min: 0.0,
                            decimalsInFloat: 2,
                        },
                        tooltip: {
                            enabled: false
                        },
                        annotations: {
                            yaxis: [
                                {
                                    y: 0.1,
                                    borderColor: theme.palette.primary[800],
                                    label: {
                                        borderColor: theme.palette.primary[800],
                                        style: {
                                            color: '#fff',
                                            background: theme.palette.primary[800],
                                        },
                                        text: 'Minimum value',
                                    },
                                },
                                {
                                    y: 0.3,
                                    borderColor: theme.palette.primary[800],
                                    label: {
                                        borderColor: theme.palette.primary[800],
                                        style: {
                                            color: '#fff',
                                            background: theme.palette.primary[800],
                                        },
                                        text: 'Lower quartile',
                                    },
                                },
                                {
                                    y: 0.55,
                                    borderColor: theme.palette.primary[800],
                                    label: {
                                        borderColor: theme.palette.primary[800],
                                        style: {
                                            color: '#fff',
                                            background: theme.palette.primary[800],
                                        },
                                        text: 'Median',
                                    },
                                },
                                {
                                    y: 0.7,
                                    borderColor: theme.palette.primary[800],
                                    label: {
                                        borderColor: theme.palette.primary[800],
                                        style: {
                                            color: '#fff',
                                            background: theme.palette.primary[800],
                                        },
                                        text: 'Upper quartile',
                                    },
                                },
                                {
                                    y: 0.9,
                                    borderColor: theme.palette.primary[800],
                                    label: {
                                        borderColor: theme.palette.primary[800],
                                        style: {
                                            color: '#fff',
                                            background: theme.palette.primary[800],
                                        },
                                        text: 'Maximum value',
                                    },
                                },
                            ],
                        },
                    }}
                />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography variant="subtitle1" marginRight={2}>
                    For more information on box plot charts check out one of the following links:
                    <br/>
                    <Link href="https://www.simplypsychology.org/boxplots.html" target="_blank" rel="noopener">
                        Link 1
                    </Link>, &nbsp;
                    <Link href="https://mlsamurai.medium.com/how-to-read-and-make-box-plot-a-complete-guide-best-practices-92b233e59c3b" target="_blank" rel="noopener">
                        Link 2
                    </Link>, &nbsp;
                    <Link href="https://www.fusioncharts.com/resources/chart-primers/box-and-whisker-chart" target="_blank" rel="noopener">
                        Link 3
                    </Link>.
                </Typography>

            </Grid>
        </Grid>
    );
};

export default BoxPlotLegend;