import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PlaceIcon from '@mui/icons-material/Place';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MultiVenueCards from "./MultiVenueCards";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { Link as LinkRouter } from 'react-router-dom'

export default function Hosting() {

    const [loading, setLoading] = useState(true)
    const [venuesData, setVenuesData] = useState(null)

    useEffect(() => {
        axios.get('/api/venues/owned')
            .then(({ data }) => {
                setVenuesData(data)
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
                <Stack direction='row' alignItems='center' flexWrap='wrap' spacing={2}>
                    <Stack direction='row' alignItems='center'>
                        <AddCircleIcon />
                        <Typography variant="h5" ml={1}>
                            Create:
                        </Typography>
                    </Stack>
                    <Stack direction='row' spacing={2}>
                        <Button variant="contained" startIcon={<EventNoteIcon />} LinkComponent={LinkRouter} to='/events/create'>
                            Event
                        </Button>
                        <Button variant="contained" startIcon={<AddLocationAltIcon />} LinkComponent={LinkRouter} to='/venues/create'>
                            Venue
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
            <Paper sx={{ p: 3, mt: 3, transition: 'background 0.2s' }}>
                <Stack direction='row' justifyContent='space-between' flexWrap='wrap'>
                    <Stack direction='row' alignItems='center'>
                        <PlaceIcon />
                        <Typography variant="h5" ml={1}>
                            Owned venues
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>
            <MultiVenueCards venuesData={venuesData} />
        </Container>
    )
}