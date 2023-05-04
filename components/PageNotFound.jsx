import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

export default function PageNotFound() {
    return (
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
            <Stack alignItems='center' spacing={2}>
                <Typography variant='h4'>Page not found!</Typography>
                <Link component={RouterLink} to='/browse' replace><Typography variant="h5">Go back home</Typography></Link>
            </Stack>
        </Box>
    )
}