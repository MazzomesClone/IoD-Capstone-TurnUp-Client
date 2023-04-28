import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid'
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import EventIcon from '@mui/icons-material/Event';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import axios from "axios";
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { Link as RouterLink, useOutletContext } from 'react-router-dom'
import { TabPack } from "../constructors/TabPack";
import { Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCurrentUser, useSavedEvents } from "../context/UserContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { formatDate } from "../utils/formatDate";
import SaveIconButton from "./SaveIconButton";
import SavedUsersAvatarStack from "./SavedUsersAvatarStack";
import GoogleMap from "./GoogleMap";
import { useRouteMatch } from "../hooks/useRouteMatch";
import { Avatar, Divider, IconButton, TextField } from "@mui/material";
import { getTimeUntilEvent } from "../utils/getTimeUntilEvent";
import { useFormControl } from "../hooks/useFormControl";

function SingleDiscussionCard({ data, currentUserId }) {

    const { userId, postBody, createdAt } = data

    const { firstName, lastName, pfp } = userId
    const { formattedDate, formattedTime } = formatDate(createdAt)

    return (
        <Paper sx={{ p: 1.5 }}>
            <Stack>
                <Stack direction='row' justifyContent='space-between' alignItems='flex-start' flexWrap='wrap' mb={1}>
                    <Stack direction='row' alignItems='center' flexWrap='wrap'>
                        {/* {currentUserId === userId._id &&
                            <IconButton onClick={() => { }} sx={{ ml: 'auto' }}>
                                <MoreVertIcon />
                            </IconButton>
                        } */}
                        <Avatar alt={`${firstName} ${lastName}`} src={pfp} sx={{ width: '1.5em', height: '1.5em' }} />
                        <Typography mt={0.3} ml={1} fontWeight='500' fontSize='1.1em'>
                            {firstName} {lastName}
                        </Typography>
                    </Stack>
                    <Typography color='text.secondary' fontSize='small'>
                        {formattedTime} · {formattedDate}
                    </Typography>
                </Stack>
                <Divider />
                <Typography mt={1}>
                    {postBody}
                </Typography>
            </Stack>
        </Paper>
    )
}

function EventDiscussion() {

    const user = useCurrentUser()

    const { eventId, discussionData, setDiscussionData } = useOutletContext()
    const [loading, setLoading] = useState(!discussionData)
    const [error, setError] = useState(false)

    const { inputProps: postProps, setValue: setPostValue } = useFormControl('')

    function handlePostSumbit() {
        if (!postProps.value) return
        setPostValue('')
        const newEntry = {
            postBody: postProps.value,
            eventId
        }
        axios.post('/api/events/discussion/new', newEntry)
            .then(() => getDiscussionData())
            .catch((err) => console.log(err.message))
    }

    function getDiscussionData() {
        axios.get(`/api/events/discussion/${eventId}`)
            .then(({ data }) => {
                setDiscussionData(data)
                setLoading(false)
            })
            .catch(() => {
                console.log(err.message)
                setError(true)
            })
    }

    useEffect(() => {
        if (!discussionData) getDiscussionData()
    }, [])

    console.log(discussionData)

    if (error) return (
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h6'>Something went wrong!</Typography>
        </Box>
    )

    if (loading) return (
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    )

    return (
        <Container maxWidth='sm' >
            <Stack spacing={2} mt={3} mb={2}>

                <Paper sx={{ p: 1.5 }}>
                    <Stack direction='row' spacing={1}>

                        {user ?
                            <Avatar alt={`${user.firstName} ${user.lastName}`} src={user.pfp} sx={{ width: '1.5em', height: '1.5em' }} />
                            :
                            <></>
                        }

                        <TextField fullWidth
                            multiline
                            variant="standard"
                            disabled={!user}
                            {...postProps}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handlePostSumbit();
                                }
                            }}
                            placeholder={user ? 'Join the discussion' : 'Sign in to join the discussion'}
                        />
                        <IconButton sx={{ color: 'primary.main', alignSelf: 'flex-end' }} disabled={!postProps.value} onClick={handlePostSumbit}>
                            <SendIcon />
                        </IconButton>

                    </Stack>
                </Paper>

                {discussionData.map((item, index) => <SingleDiscussionCard data={item} currentUserId={user?._id} key={index} />)}
            </Stack>
        </Container>
    )
}

function EventUpdates() {
    return (
        <>Updates</>
    )
}

export const EventTabPack = new TabPack(
    'events/:eventId',
    [
        {
            path: 'discussion',
            component: <EventDiscussion />
        },
        {
            path: 'updates',
            component: <EventUpdates />
        }
    ]
)

export default function SingleEventPage() {

    const [eventData, setEventData] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const [discussionData, setDiscussionData] = useState(null)

    const { isEventSaved, saveEvent, unsaveEvent } = useSavedEvents(eventData._id)

    const { eventId } = useParams()

    const isMobile = useIsMobile()

    const currentTab = useRouteMatch(EventTabPack)

    function getEventPageData() {
        axios.get(`/api/events/pagedata/${eventId}`)
            .then(({ data }) => {
                setEventData(data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setError(true)
            })
    }

    useEffect(() => {
        getEventPageData()
    }, [isEventSaved])

    //console.log(eventData)

    const { name, date, primaryImage, description, usersThatSaved, venueId } = eventData

    const { formattedTime, formattedDate } = formatDate(date)

    if (error) return (
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h4'>Something went wrong!</Typography>
        </Box>
    )

    if (loading) return (
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    )

    return (
        <Container maxWidth='md'>
            <Paper sx={{ width: '100%', transition: 'background 0.2s' }}>
                <Box sx={{
                    height: '40vw',
                    maxHeight: '350px',
                    backgroundImage: `url(${primaryImage})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                }} />
                <Box px={isMobile ? 3 : 1.5} pt={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={7}>

                            {/* Event date and saved avatars */}
                            <Stack direction='row' alignItems='center' mb={1.5} flexWrap='wrap'>
                                <Stack direction='row' alignItems='center' width='max-content'>
                                    <EventIcon sx={{ pr: 1, fontSize: '3.2em', transform: 'translateY(0.05em)' }} />
                                    <Stack spacing={-1}>
                                        <Stack direction='row' alignItems='center'>
                                            <Typography fontSize='1.2em'>
                                                {formattedTime}
                                            </Typography>
                                            <SaveIconButton
                                                isSaved={isEventSaved}
                                                handleSave={saveEvent}
                                                handleUnsave={unsaveEvent}
                                                thingToSave='event'
                                                sx={{ ml: 'auto', transform: 'translateX(0.8em) translateY(-0.15em)' }}
                                            />
                                        </Stack>
                                        <Typography color='text.secondary'>
                                            {formattedDate}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Box ml='auto'>
                                    <SavedUsersAvatarStack usersThatSaved={usersThatSaved} />
                                </Box>
                            </Stack>

                            <Divider />

                            {/* Event name */}
                            <Stack direction='row' alignItems='center' mb={1} mt={2}>
                                <Stack spacing={0.3}>
                                    <Stack direction='row' alignItems='center' spacing={1}>
                                        <Typography variant='h5' fontWeight='500' lineHeight={1}>
                                            {name}
                                        </Typography>
                                    </Stack>
                                    <Typography color='text.secondary'>
                                        {getTimeUntilEvent(date)}
                                    </Typography>
                                </Stack>
                            </Stack>

                            {/* Description */}
                            <Typography>
                                {description}
                            </Typography>
                        </Grid>

                        {/* Venue and Map */}
                        <Grid item xs={12} md={5}>
                            <Stack>
                                <Stack direction='row' mb={2}>
                                    <Stack spacing={-0.8}>
                                        <Typography variant="h6" >
                                            {venueId.name}
                                        </Typography>
                                        <Typography color='text.secondary'>
                                            {venueId.addressArray[1]}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <GoogleMap placeId={venueId.placeId} />
                            </Stack>
                        </Grid>

                    </Grid>

                    {/* Tabs */}
                    <Tabs sx={{ mt: 3 }} value={currentTab} variant='fullWidth' centered >
                        {EventTabPack.routePathsAndComponents.map(({ path }) =>
                            <Tab label={path} value={path} LinkComponent={RouterLink} to={path} key={path} replace />
                        )}
                    </Tabs>
                </Box>
            </Paper>
            <Outlet context={{ eventId: eventData._id, discussionData, setDiscussionData }} />
        </Container>
    )
}
