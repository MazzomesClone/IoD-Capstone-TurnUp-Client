import Stack from '@mui/material/Stack'
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
import { StyledLinkRouter } from './StyledLinkRouter'
import { useTheme } from '@mui/material'
import LiveIndicator from './LiveIndicator'
import { getTimeUntilEvent } from '../utils/getTimeUntilEvent'

function EventCard({ eventData }) {

    const theme = useTheme()

    const { isEventSaved, saveEvent, unsaveEvent } = useSavedEvents(eventData._id)

    const { name, date, endDate, primaryImage, venueId } = eventData
    const timeUntilEvent = getTimeUntilEvent(date, endDate)
    const eventHappeningNow = timeUntilEvent === 'Happening now'
    const { formattedTime, formattedDate } = formatDate(date)

    return (
        <Grid item xs={12} md={4} sm={6}>
            <Paper>
                <LinkRouter to={`/events/${eventData._id}`}>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Box sx={{
                            height: '40vw',
                            maxHeight: '200px',
                            backgroundImage: `url(${primaryImage})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            background: !primaryImage && `linear-gradient(to bottom, ${theme.palette.primary.main}, transparent)`,
                            transition: 'opacity 0.5s, transform 0.5s',
                            cursor: 'pointer',
                            ":hover": {
                                opacity: 0.9,
                                transform: 'scale(1.02)'
                            }
                        }} />
                    </Box>
                </LinkRouter>
                <Box sx={{ p: 1.5 }}>

                    {/* Event name & save */}
                    <Stack direction='row' alignItems='center'>
                        <EventIcon sx={{ pr: 1 }} />
                        <Stack spacing={-0.8}>
                            <Stack direction='row' alignItems='center' spacing={1}>
                                <StyledLinkRouter to={`/events/${eventData._id}`}>
                                    <Typography variant='h6' fontWeight='500' lineHeight={1}>
                                        {name}
                                    </Typography>
                                </StyledLinkRouter>
                                <SaveIconButton isSaved={isEventSaved}
                                    handleSave={saveEvent}
                                    handleUnsave={unsaveEvent}
                                    thingToSave='event'
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                    <StyledLinkRouter to={`/venues/${eventData.venueId._id}`}>
                        <Typography>
                            {venueId.name} - {venueId.addressArray[1]}
                        </Typography>
                    </StyledLinkRouter>
                    <Stack direction='row' alignItems='center'>
                        {eventHappeningNow && <LiveIndicator />}
                        <Typography color='text.secondary'>
                            {formattedTime} {formattedDate}
                        </Typography>
                    </Stack>
                </Box>
            </Paper>
        </Grid>
    )
}

export default function MultiEventCards({ eventsData }) {

    const isMobile = useIsMobile()

    const EventCards = eventsData.map((event, index) => <EventCard eventData={event} key={index} />)

    if (eventsData.length === 0) return (
        <Typography color='text.secondary' mt={3} textAlign='center'>
            No events
        </Typography>
    )

    return (
        <Grid container spacing={3} mt={1} px={isMobile ? 3 : 0}>
            {EventCards}
        </Grid>
    )
}
