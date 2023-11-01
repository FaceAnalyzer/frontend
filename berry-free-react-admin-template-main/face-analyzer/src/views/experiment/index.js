
// ==============================|| EXPERIMENT DASHBOARD ||============================== //


import { Box, Grid } from '@mui/material';
import { Button, Typography } from '@mui/material';
import { IconEdit, IconTrashOff } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { gridSpacing } from 'store/constant';
/**
 * Experiment view component.
 * @returns {JSX.Element} Experiment view JSX.Element.
 */

const Experiment = () => {
  const [, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing} sx={{ padding: '16px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {/* Text below should be loaded from backend */}
          Experiment Title 
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ ml: 1 }}>
            <Button variant="contained" color="error" href="/experiment/delete">
              {/* href/onclick should open a dialog box asking for conformation for deletion*/}
              <IconTrashOff color='black' />
              <Typography sx={{ color: 'black' }}>
                Delete experiment
              </Typography>
            </Button>
          </Box>
          <Box sx={{ ml: 1 }}>
            <Button variant="contained" color="info" href='/experiment/edit'>
              <IconEdit color='black'/>
              <Typography sx={{ color: 'black' }}>
                Edit experiment
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
      <Grid item lg={4} md={6} sm={6} xs={12}>
      </Grid>
      <Grid item lg={4} md={6} sm={6} xs={12}>
      </Grid>
      <Grid item xs={12}>
      </Grid>
    </Grid>
  );
};

export default Experiment;
