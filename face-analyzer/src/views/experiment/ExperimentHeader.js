import React from 'react';
import { Button, Typography, Box, Grid } from '@mui/material';
import { IconEdit, IconTrashOff } from '@tabler/icons';

const ExperimentHeader = () => {

    return (
        <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
                <Typography variant="h4">
                    {/* Text below should be loaded from backend */}
                    Experiment Title 
                </Typography>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ ml: 1 }}>
                        <Button variant="contained" color="info" href="experiment/edit">
                            {/* href/onclick should open a dialog box asking for conformation for edit*/}
                            <IconEdit color='black'/>
                            <Typography sx={{ color: 'black' }}>
                                Edit experiment
                            </Typography>
                        </Button>
                    </Box>
                    <Box sx={{ ml: 1 }}>
                        <Button variant="contained" color="error" href="/experiment/delete">
                            {/* href/onclick should open a dialog box asking for conformation for deletion*/}
                            <IconTrashOff color='black' />
                            <Typography sx={{ color: 'black' }}>
                                Delete experiment
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default ExperimentHeader;