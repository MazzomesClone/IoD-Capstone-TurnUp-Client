import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import EventIcon from '@mui/icons-material/Event';
import { useEffect, useState } from "react";
import axios from "axios";
import MultiEventCards from "./MultiEventCards";

export default function HostedEvents() {

    const [loading, setLoading] = useState(true)
    const [eventsData, setEventsData] = useState(null)

    useEffect(() => {
        axios.get('/api/events/owned')
            .then(({ data }) => {
                setEventsData(data)
                setLoading(false)
            })
            .catch(err => console.log(err.message))
    }, [])

    if (loading) return (
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
                            Owned events
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>
            <MultiEventCards eventsData={eventsData} />
        </Container>
    )
}