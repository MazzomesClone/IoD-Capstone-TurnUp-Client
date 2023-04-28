import Stack from '@mui/material/Stack'
import Container from '@mui/material/Container'
import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import EventIcon from '@mui/icons-material/Event';
import Typography from '@mui/material/Typography'
import { useIsMobile } from '../hooks/useIsMobile'
import { useSavedEvents } from '../context/UserContext'
import { formatDate } from '../utils/formatDate'
import SaveIconButton from './SaveIconButton'
import { Link as LinkRouter } from 'react-router-dom'

function EventCard({ eventData }) {

    console.log(eventData)

    const isMobile = useIsMobile()

    const { isEventSaved, saveEvent, unsaveEvent } = useSavedEvents(eventData._id)

    const { name, date, primaryImage, venueId } = eventData

    const { formattedTime, formattedDate } = formatDate(date)

    return (
        <Grid item xs={12} md={6}>
            <Paper>
                <LinkRouter to={`/events/${eventData._id}`}>
                    <Box sx={{
                        height: '40vw',
                        maxHeight: '300px',
                        backgroundImage: `url(${primaryImage})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        transition: 'opacity 0.2s',
                        ":hover": {
                            opacity: 0.9
                        }
                    }} />
                </LinkRouter>
                <Box sx={{ p: 1.5 }}>

                    {/* Event name & save */}
                    <Stack direction='row' alignItems='center'>
                        <EventIcon sx={{ pr: 1 }} />
                        <Stack spacing={-0.8}>
                            <Stack direction='row' alignItems='center' spacing={1}>
                                <Typography variant='h6' fontWeight='500' lineHeight={1}>
                                    {name}
                                </Typography>
                                <SaveIconButton isSaved={isEventSaved}
                                    handleSave={saveEvent}
                                    handleUnsave={unsaveEvent}
                                    thingToSave='event'
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                    <Typography>
                        {venueId.name} - {venueId.addressArray[1]}
                    </Typography>
                    <Typography color='text.secondary'>
                        {formattedTime} {formattedDate}
                    </Typography>
                </Box>
            </Paper>
        </Grid>
    )
}

export default function MultiEventCards({ eventsData }) {

    const EventCards = eventsData.map(event => <EventCard eventData={event} />)

    return (
        <Container maxWidth='lg' sx={{ mt: 3 }}>
            <Grid container spacing={3}>
                {EventCards}
            </Grid>
        </Container>
    )
}
