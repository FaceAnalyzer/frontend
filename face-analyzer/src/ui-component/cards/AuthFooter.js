// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://visagetechnologies.com/" target="_blank" underline="hover">
    visagetechnologies.com
    </Typography>
    <Typography variant="subtitle2" component={Link} href="https://github.com/FaceAnalyzer" target="_blank" underline="hover">
      github.com/FaceAnalyzer
    </Typography>
  </Stack>
);

export default AuthFooter;
