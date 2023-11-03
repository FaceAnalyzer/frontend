import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { IconEdit, IconTrashOff } from '@tabler/icons';


const ExperimentHeader = () => (
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
        <Button variant="contained" color="info" > {/* href/onclick should open a dialog box asking for conformation for edit*/}
          <IconEdit color='black'/>
          <Typography sx={{ color: 'black' }}>
            Edit experiment
          </Typography>
        </Button>
      </Box>
    </Box>
  </Box>
)

export default ExperimentHeader;