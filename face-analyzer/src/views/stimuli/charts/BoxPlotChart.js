import {Grid} from "@mui/material";
import Chart from "react-apexcharts";
import {boxPlotData} from "./dummy-chart-data";
import {useTheme} from "@mui/material/styles";

// ==============================|| BOX PLOT CHART ||============================== //

const BoxPlotChart = () => {
    const theme = useTheme();

    const data = [];
    Object.entries(boxPlotData).forEach(([emotion, values]) => {
        data.push({
            x: emotion,
            y: values.slice().sort((a, b) => a - b)
        });
    });
    console.log(data);

    return (<Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Chart
                    type="boxPlot"
                    series={[
                        {
                            type: 'boxPlot',
                            data: data
                        }
                    ]}
                    options={{
                        chart: {
                            type: 'boxPlot',
                            height: 350
                        },
                        title: {
                            text: 'Emotions Distribution',
                            align: 'left'
                        },
                        plotOptions: {
                            boxPlot: {
                                colors: {
                                    upper: theme.palette.primary[800],
                                    lower: theme.palette.primary[200]
                                }
                            }
                        }
                    }}
                    // series={[{data: [boxPlotData[emotion]]}]}
                    // options={{
                    //     chart: {
                    //         sparkline: {
                    //             enabled: true
                    //         }
                    //     },
                    //     colors: [boxPlotData[emotion]],
                    //     title: {
                    //         text: emotion,
                    //         style: {
                    //             fontSize: '14px'
                    //         }
                    //     }
                    // }}
                />
            </Grid>
        </Grid>
    );
};

export default BoxPlotChart;