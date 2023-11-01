import { Grid, Typography } from "@mui/material";

const gridSpacing = 2;

const ExperimentEdit = () => {
    return (
        <Grid container direction="column" spacing={gridSpacing} sx={{ padding: '16px' }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
                {/* Text below should be loaded from backend */}
                Edit Experiment
            </Typography>
            <Typography variant="h4" sx={{ mb: 2 }}>
                {/* Text below should be loaded from backend */}
                Experiment Title
            </Typography>
            <textarea rows="4" cols="50" placeholder="Experiment Title" />
            <Typography variant="h4" sx={{ mb: 2 }}>
                {/* Text below should be loaded from backend */}
                Experiment Description
            </Typography>
            <textarea rows="4" cols="50" placeholder="Experiment Description" />
            <button>Save</button>
        </Grid>
    );
}

export default ExperimentEdit;