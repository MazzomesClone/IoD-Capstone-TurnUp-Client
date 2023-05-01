import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSavedVenues } from "../context/UserContext"
import EventIcon from '@mui/icons-material/Event';
import MultiVenueCards from "./MultiVenueCards";

export default function SavedVenues() {

    const { savedVenues } = useSavedVenues()

    if (!savedVenues) return (
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    )

    return (
        <Container maxWidth='lg' sx={{ pt: 3 }}>
            <Paper sx={{ p: 3, transition: 'background 0.2s' }}>
                <Stack direction='row' justifyContent='space-between' flexWrap='wrap'>
                    <Stack direction='row' alignItems='center'>
                        <EventIcon />
                        <Typography variant="h5" ml={1}>
                            Saved venues
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>
            <MultiVenueCards venuesData={savedVenues} />
        </Container>
    )
}