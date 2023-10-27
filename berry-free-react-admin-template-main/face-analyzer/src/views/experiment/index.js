import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';

// ==============================|| EXPERIMENTS DASHBOARD ||============================== //

import { Typography } from '@mui/material';
import { IconEdit, IconTrashOff } from '@tabler/icons';

/**
 * Experiment view component.
 * @returns {JSX.Element} Experiment view JSX.Element.
 */
import { Box } from '@mui/material';

const Experiment = () => {
  const [, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing} sx={{ padding: '16px' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Experiment Title
      </Typography>
      <Box sx={{ ml: 70 }}>
        <IconTrashOff color='red' />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Delete experiment
        </Typography> 
      </Box>
      <Box sx={{ ml: 10 }}>
        <IconEdit/>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Edit experiment
        </Typography> 
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
