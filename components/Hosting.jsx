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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MultiVenueCards from "./MultiVenueCards";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { Link as LinkRouter } from 'react-router-dom'
import IconButton from "@mui/material/IconButton";
import EventIcon from '@mui/icons-material/Event';
import MultiEventCards from "./MultiEventCards";
import EventDateFilter from "./EventDateFilter";

export default function Hosting() {

    const [venuesLoading, setVenuesLoading] = useState(true)
    const [venuesData, setVenuesData] = useState(null)

    const [eventsLoading, setEventsLoading] = useState(true)
    const [eventsData, setEventsData] = useState(null)
    const [filteredEventsData, setFilteredEventsData] = useState(null)

    const [eventsOpen, setEventsOpen] = useState(true)
    const [venuesOpen, setVenuesOpen] = useState(false)

    useEffect(() => {
        axios.get('/api/venues/owned')
            .then(({ data }) => {
                setVenuesData(data)
                setVenuesLoading(false)
            })
            .catch(err => console.log(err.message))

        axios.get('/api/events/userhosted')
            .then(({ data }) => {
                setEventsData(data)
                setEventsLoading(false)
            })
            .catch(err => console.log(err.message))
    }, [])

    return (
        <Container maxWidth='lg' sx={{ pt: 3 }}>
            <Paper sx={{ p: 3, transition: 'background 0.2s' }}>
                <Stack direction='row' alignItems='center' flexWrap='wrap' spacing={2}>
                    <Stack direction='row' alignItems='center'>
                        <AddCircleIcon />
                        <Typography variant="h5" ml={1}>
                            Create
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

            {/* Hosted Events */}
            <Paper sx={{ p: 3, mt: 3, transition: 'background 0.2s' }}>
                <Stack direction='row' justifyContent='space-between' flexWrap='wrap'>
                    <Stack direction='row' alignItems='center'>
                        <EventIcon />
                        <Typography variant="h5" ml={1}>
                            Hosted events
                        </Typography>
                        <IconButton onClick={() => setEventsOpen(!eventsOpen)}>
                            {eventsOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                        </IconButton>
                    </Stack>
                </Stack>
            </Paper>
            {eventsLoading ?
                <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
                : <>
                    {eventsOpen &&
                        <>
                            <EventDateFilter eventsData={eventsData} setFilteredEventsData={setFilteredEventsData} />
                            <MultiEventCards eventsData={filteredEventsData} />
                        </>
                    }
                </>
            }

            {/* Owned venues */}
            <Paper sx={{ p: 3, mt: 3, transition: 'background 0.2s' }}>
                <Stack direction='row' justifyContent='space-between' flexWrap='wrap'>
                    <Stack direction='row' alignItems='center'>
                        <PlaceIcon />
                        <Typography variant="h5" ml={1}>
                            Owned venues
                        </Typography>
                        <IconButton onClick={() => setVenuesOpen(!venuesOpen)}>
                            {venuesOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                        </IconButton>
                    </Stack>
                </Stack>
            </Paper>
            {venuesLoading ?
                <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
                : <>
                    {venuesOpen &&
                        <MultiVenueCards venuesData={venuesData} />
                    }
                </>
            }
        </Container>
    )
}