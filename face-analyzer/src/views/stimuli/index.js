import React, {useEffect, useState} from 'react';

// material-ui
import {Grid} from '@mui/material';

// project imports
import {gridSpacing} from 'store/constant';
import {useParams} from "react-router";
import axios from "axios";
import {GET_STIMULI_API} from "../projects/BackendEndpoints";
import StimuliHeader from "./StimuliHeader";

// ==============================|| STIMULUS DASHBOARD ||============================== //

const Stimuli = () => {
    const {stimuliId} = useParams();
    const [stimuliData, setStimuliData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    console.log(isLoading); //stop lint errors

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ID = parseInt(stimuliId);
                console.log(ID);

                const stimuliResponse = await axios.get(GET_STIMULI_API + '/' + stimuliId);
                console.log(stimuliResponse);
                const {items} = stimuliResponse.data;
                setStimuliData(items[0]);

                setLoading(false);

            } catch (error) {
                console.error('Error fetching stimuli data:', error);
                setLoading(false); // Set loading to false even in case of an error
            }
        };

        fetchData();
    }, [stimuliId]);

    return (
        <Grid container spacing={gridSpacing} sx={{padding: '16px'}}>
            <Grid item xs={12}>
                <StimuliHeader data={stimuliData}/>
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
                {/*<AddReactionCard isLoading={isLoading} stimuliId={stimuliId}/>*/}
            </Grid>
            {/*{reactionList && reactionList.map((stimulus) => (*/}
            {/*    <Grid item key={reaction.id} lg={4} md={6} sm={6} xs={12}>*/}
            {/*        <StimuliCard isLoading={isLoading} data={reaction}/>*/}
            {/*    </Grid>*/}
            {/*))}*/}
        </Grid>
    );
};

export default Stimuli;
