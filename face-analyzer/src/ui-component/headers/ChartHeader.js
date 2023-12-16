import React from 'react';
import {useTheme} from "@mui/material/styles";
import {Box, Button, CardHeader, Link, Typography} from "@mui/material";
import AnimateButton from "../extended/AnimateButton";
import {IconChevronRight, IconDownload, IconFlask, IconGraph, IconVideo} from "@tabler/icons";
import PropTypes from "prop-types";
import Papa from "papaparse";
import {FolderOpen} from "@mui/icons-material";

// ===========================|| CHART HEADER ||=========================== //

const ChartHeader = ({
                         activeButton,
                         setActiveButton,
                         emotionsData,
                         reactionData,
                         stimuliData,
                         experimentData,
                         projectData
                     }) => {
    const theme = useTheme();

    const stimuli = stimuliData;
    const stimuliId = stimuli.id;
    const experiment = experimentData;
    const experimentId = experiment.id;
    const project = projectData;
    const projectId = project.id;

    const handleButtonClick = (buttonType) => {
        setActiveButton(buttonType);
    };

    const sortData = (data) => {
        const sortedData = {};
        for(let key in data){
            const tempData = data[key];
            sortedData[key] = tempData.sort((a, b) => a.timeOffset - b.timeOffset);
        }
        return sortedData;
    }

    const createCsvString = (headers, dataArray) => {
        const csvArray = dataArray.map((obj) => {
            const row = {};
            headers.forEach((header) => {
                row[header] = obj[header];
            });
            return row;
        });

        return Papa.unparse({
            fields: headers,
            data: csvArray
        })
    }

    const convertToCSV = (data) => {
        const headers = ['TimeOffset', ...Object.keys(data)];
        const sortedData = sortData(data);

        const arrayLength = sortedData.Anger.length;
        const combinedArray = Array.from({length: arrayLength}, (_, index) => {
            const row = {TimeOffset: data.Anger[index].timeOffset};
            Object.keys(sortedData).forEach((attribute) => {
                row[attribute] = sortedData[attribute][index].value;
            });
            return row;
        });

        //console.log("sd", sortedData);
        //console.log("ca", combinedArray);

        return createCsvString(headers, combinedArray);
    }

    const exportCsv = () => {
        const dataCSV = convertToCSV(emotionsData);
        const filename = (() => {
            const participantName = reactionData.participantName;
            const stimuliId = reactionData.stimuliId;
            const reactionId = reactionData.id;
            return ["Reaction", participantName.replaceAll(" ", "-"), stimuliId, reactionId].join('_');
        });

        const blob = new Blob([dataCSV], {
            type: 'text/csv;charset=utf-8;'
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename();
        link.click();
    };

    return (
        <Box>
            <Box>
                <CardHeader sx={{padding: '5px'}}
                            subheader={
                                <Box sx={{display: 'flex'}}>
                                    <Link id={"breadcrumb-to-project"} href={`/project/${projectId}`}
                                          sx={{color: theme.palette.grey[500], textDecoration: 'none'}}
                                    >
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <FolderOpen/>&nbsp;
                                            <Typography sx={{fontWeight: 500}}>{project.name}</Typography>
                                        </Box>
                                    </Link>
                                    &nbsp;
                                    <IconChevronRight />
                                    <Link id={"breadcrumb-to-experiment"} href={`/experiment/${experimentId}`}
                                          sx={{color: theme.palette.grey[500], textDecoration: 'none'}}
                                    >
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <IconFlask/>
                                            <Typography sx={{fontWeight: 500}}>{experiment.name}</Typography>
                                        </Box>
                                    </Link>
                                    &nbsp;
                                    <IconChevronRight />
                                    <Link id={"breadcrumb-to-stimuli"} href={`/stimuli/${stimuliId}`}
                                          sx={{color: theme.palette.grey[500], textDecoration: 'none'}}
                                    >
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <IconVideo/>&nbsp;
                                            <Typography sx={{fontWeight: 500}}>{stimuli.name}</Typography>
                                        </Box>
                                    </Link>
                                </Box>
                            }/>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <IconGraph/>
                <CardHeader title={
                    <Typography sx={{
                        fontSize: '1.5rem',
                        fontWeight: 500
                    }}>
                        {reactionData.participantName}
                    </Typography>
                }/>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', gap: 1, pr: 2}}>
                    <AnimateButton>
                        <Button
                            id={"button-emotions-over-time"}
                            onClick={() => handleButtonClick('overTime')}
                            sx={activeButton === 'overTime' ? {
                                color: theme.palette.secondary
                            } : {
                                color: theme.palette.grey[700],
                                backgroundColor: theme.palette.grey[50],
                            }}
                            variant={activeButton === 'overTime' ? 'contained' : ''}
                            disableElevation
                        >
                            Emotions over time
                        </Button>
                    </AnimateButton>
                    <AnimateButton>
                        <Button
                            id={"button-emotions-distribution"}
                            onClick={() => handleButtonClick('distribution')}
                            sx={activeButton === 'distribution' ? {
                                color: theme.palette.secondary
                            } : {
                                color: theme.palette.grey[700],
                                backgroundColor: theme.palette.grey[50],
                            }}
                            variant={activeButton === 'distribution' ? 'contained' : ''}
                            disableElevation
                        >
                            Emotions distribution
                        </Button>
                    </AnimateButton>
                </Box>
                <Box>
                    <AnimateButton>
                        <Button
                            id={"button-export-csv"}
                            sx={{color: theme.palette.secondary}}
                            variant={'contained'}
                            disableElevation
                            onClick={exportCsv}
                        >
                            <IconDownload/> Export CSV
                        </Button>
                    </AnimateButton>
                </Box>
            </Box>
        </Box>
    );
};

ChartHeader.propTypes = {
    activeButton: PropTypes.string,
    setActiveButton: PropTypes.func,
    emotionsData: PropTypes.object,
    reactionData: PropTypes.object
}

export default ChartHeader;