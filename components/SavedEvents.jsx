import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSavedEvents } from "../context/UserContext"
import EventDateFilter from "./EventDateFilter"
import MultiEventCards from "./MultiEventCards"
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useState } from "react"

export default function SavedEvents() {

    const { savedEvents } = useSavedEvents()
    const [filteredEventsData, setFilteredEventsData] = useState(savedEvents)

    if (!savedEvents) return (
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    )

    return (
        <Container maxWidth='lg' sx={{ pt: 3 }}>
            <Paper sx={{ p: 3, transition: 'background 0.2s' }}>
                <Stack direction='row' justifyContent='space-between' flexWrap='wrap'>
                    <Stack direction='row' alignItems='center'>
                        <EventAvailableIcon />
                        <Typography variant="h5" ml={1}>
                            Saved events
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>
            <EventDateFilter eventsData={savedEvents} setFilteredEventsData={setFilteredEventsData} />
            <MultiEventCards eventsData={filteredEventsData} />
        </Container>
    )
}