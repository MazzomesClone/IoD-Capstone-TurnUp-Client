import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid'
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import EventIcon from '@mui/icons-material/Event';
import SendIcon from '@mui/icons-material/Send';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { Link as RouterLink, useNavigate, useOutletContext } from 'react-router-dom'
import { TabPack } from "../constructors/TabPack";
import { Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCurrentUser, useSavedEvents } from "../context/UserContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { formatDate } from "../utils/formatDate";
import SaveIconButton from "./SaveIconButton";
import SavedUsersAvatarStack from "./SavedUsersAvatarStack";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import GoogleMap from "./GoogleMap";
import { useRouteMatch } from "../hooks/useRouteMatch";
import { getTimeUntilEvent } from "../utils/getTimeUntilEvent";
import { useFormControl } from "../hooks/useFormControl";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { toast } from "react-toastify";
import { StyledLinkRouter, UnstyledLinkRouter } from "./StyledLinkRouter";
import { MenuList, Tooltip } from "@mui/material";
import LiveIndicator from "./LiveIndicator";
import { useImageUpload } from "../hooks/useImageUpload";

function SingleDiscussionCard({ data, currentUserId, getDiscussionData }) {

    const { userId, postBody, createdAt } = data

    const { firstName, lastName, pfp } = userId
    const { formattedDate, formattedTime } = formatDate(createdAt)

    /* Post menu */
    const [anchorEl, setAnchorEl] = useState(null);
    const postMenuOpen = Boolean(anchorEl);
    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget)
    const handleMenuClose = () => setAnchorEl(null)

    function handleDiscussionDelete() {
        axios.delete(`/api/events/discussion/delete/${data._id}`)
            .then(() => getDiscussionData())
            .catch(err => console.log(err))
    }

    const PostMenu = (
        <Menu
            id="host-menu"
            anchorEl={anchorEl}
            open={postMenuOpen}
            onClose={handleMenuClose}
            MenuListProps={{
                'aria-labelledby': 'host-menu',
            }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <MenuList dense>
                <MenuItem onClick={handleDiscussionDelete}>
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText>
                        Delete
                    </ListItemText>
                </MenuItem>
            </MenuList>
        </Menu>
    )

    return (
        <Paper sx={{ p: 1.5 }}>
            <Stack>
                <Stack direction='row' justifyContent='space-between' alignItems='flex-start' flexWrap='wrap' mb={1}>
                    <Stack direction='row' alignItems='center' flexWrap='wrap'>
                        <Avatar alt={`${firstName} ${lastName}`} src={pfp} sx={{ width: '1.5em', height: '1.5em' }} />
                        <Typography mt={0.3} ml={1} fontWeight='500' fontSize='1.1em'>
                            {firstName} {lastName}
                        </Typography>
                        {currentUserId === userId._id &&
                            <>
                                <IconButton onClick={handleMenuOpen}>
                                    <MoreVertIcon />
                                </IconButton>
                                {PostMenu}
                            </>
                        }
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

    const { eventId, discussionData, setDiscussionData, user } = useOutletContext()
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

                {discussionData.map((item, index) => <SingleDiscussionCard data={item} currentUserId={user?._id} key={index} getDiscussionData={getDiscussionData} />)}
            </Stack>
        </Container>
    )
}

function SingleUpdateCard({ data, userHostsEvent, getUpdatesData }) {

    const { primaryImage, postBody, createdAt } = data

    const { formattedDate, formattedTime } = formatDate(createdAt)

    console.log(data)

    /* Post menu */
    const [anchorEl, setAnchorEl] = useState(null);
    const updateMenuOpen = Boolean(anchorEl);
    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget)
    const handleMenuClose = () => setAnchorEl(null)

    function handleUpdateDelete() {
        axios.delete(`/api/events/updates/delete/${data._id}`)
            .then(() => {
                toast.success('Update deleted')
                getUpdatesData()
            })
            .catch(err => console.log(err))
    }

    const UpdateMenu = (
        <Menu
            id="host-menu"
            anchorEl={anchorEl}
            open={updateMenuOpen}
            onClose={handleMenuClose}
            MenuListProps={{
                'aria-labelledby': 'host-menu',
            }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <MenuList dense>
                <MenuItem onClick={handleUpdateDelete}>
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText>
                        Delete
                    </ListItemText>
                </MenuItem>
            </MenuList>
        </Menu>
    )

    return (
        <Paper>
            <Stack>
                {primaryImage &&
                    <img src={primaryImage} alt="Update image" />
                }
                <Stack px={1.5} height='40px' direction='row' alignItems='center'>
                    <Typography color='text.secondary' fontSize='small'>
                        {formattedTime} {formattedDate}
                    </Typography>
                    {userHostsEvent &&
                        <>
                            <IconButton onClick={handleMenuOpen}>
                                <MoreVertIcon />
                            </IconButton>
                            {UpdateMenu}
                        </>
                    }
                </Stack>
                {/* <Divider /> */}
                <Box px={1.5} pb={1.5}>
                    <Typography>
                        {postBody}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    )
}

function EventUpdates() {

    const { ownerUserId, user, updatesData, setUpdatesData, eventId } = useOutletContext()
    const [loading, setLoading] = useState(!updatesData)
    const [error, setError] = useState(false)

    const { img, handleImgChange, setImg } = useImageUpload()
    const { inputProps: postProps } = useFormControl('')

    const userHostsEvent = ownerUserId === user?._id

    function handleImgRemove() {
        setImg({ preview: '', data: '' })
    }

    function handlePostSumbit() {
        const updateData = {
            data: {
                postBody: postProps.value
            },
            file: img.data
        }

        axios.post(`/api/events/updates/new/${eventId}`, updateData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                getUpdatesData()
                toast.success('Update posted!')
            })
            .catch(err => console.log(err))
    }

    function getUpdatesData() {
        axios.get(`/api/events/updates/${eventId}`)
            .then(({ data }) => {
                setUpdatesData(data)
                setLoading(false)
            })
            .catch(err => console.log(error))
    }

    useEffect(() => {
        if (!updatesData) getUpdatesData()
    }, [])

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
        <Container maxWidth='sm'>
            <Stack spacing={2} mt={3} mb={2}>
                {userHostsEvent &&
                    <Paper>
                        {img.preview &&
                            <>
                                <img src={img.preview} alt="Update image" width='100%' />
                            </>
                        }
                        <Box p={1.5}>
                            <Stack direction='row' justifyContent='center'>
                                <Button component="label" endIcon={<PhotoCamera />}>
                                    {img.preview ? 'Change image' : 'Add image'}
                                    <input hidden name='file' accept="image/*" type="file" onChange={handleImgChange} />
                                </Button>
                                {img.preview &&
                                    <Button component="label" endIcon={<DeleteIcon />} onClick={handleImgRemove}>
                                        Clear image
                                    </Button>
                                }
                            </Stack>
                            <Stack direction='row' spacing={1}>
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
                                    placeholder={'Update your event'}
                                />
                                <IconButton sx={{ color: 'primary.main', alignSelf: 'flex-end' }} disabled={!postProps.value} onClick={handlePostSumbit}>
                                    <SendIcon />
                                </IconButton>

                            </Stack>
                        </Box>
                    </Paper>
                }
                {updatesData.map((update, index) =>
                    <SingleUpdateCard data={update} key={index} userHostsEvent={userHostsEvent} getUpdatesData={getUpdatesData} />
                )}
            </Stack>
        </Container>
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
    const { eventId } = useParams()

    // Ensure remount when eventId changes
    return <SingleEventPageRouted eventId={eventId} key={eventId} />
}

function SingleEventPageRouted({ eventId }) {

    const navigate = useNavigate()

    const [eventData, setEventData] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const [discussionData, setDiscussionData] = useState(null)
    const [updatesData, setUpdatesData] = useState(null)

    const { isEventSaved, saveEvent, unsaveEvent } = useSavedEvents(eventData._id)

    const isMobile = useIsMobile()

    const currentTab = useRouteMatch(EventTabPack)

    const user = useCurrentUser()

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

    const { name, date, endDate, primaryImage, description, usersThatSaved, venueId } = eventData

    const timeUntilEvent = getTimeUntilEvent(date, endDate)
    const { formattedTime, formattedDate } = formatDate(date)
    const { formattedTime: formattedEndTime, formattedDate: formattedEndDate } = formatDate(endDate)

    const userHostsEvent = eventData.venueId?.ownerUserId === user?._id

    /* Host Menu */
    const [anchorEl, setAnchorEl] = useState(null);
    const hostMenuOpen = Boolean(anchorEl);
    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget)
    const handleMenuClose = () => setAnchorEl(null)

    const HostMenu = (
        <Menu
            id="host-menu"
            anchorEl={anchorEl}
            open={hostMenuOpen}
            onClose={handleMenuClose}
            MenuListProps={{
                'aria-labelledby': 'host-menu',
            }}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <MenuList>
                <MenuItem onClick={() => {
                    handleMenuClose()
                    handleCancelDialogOpen()
                }}>
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText>
                        Cancel event
                    </ListItemText>
                </MenuItem>
                <UnstyledLinkRouter to='edit'>
                    <MenuItem>
                        <ListItemIcon>
                            <EditCalendarIcon />
                        </ListItemIcon>
                        <ListItemText>
                            Edit event
                        </ListItemText>
                    </MenuItem>
                </UnstyledLinkRouter>
            </MenuList>
        </Menu>
    )

    /* Cancel event dialog */
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
    const handleCancelDialogOpen = () => setCancelDialogOpen(true)
    const handleCancelDialogClose = () => setCancelDialogOpen(false)
    const { getSavedEvents } = useSavedEvents()

    function handleCancelEvent() {
        handleCancelDialogClose()
        axios.delete(`/api/events/delete/${eventData._id}`)
            .then(() => {
                toast.success('Event cancelled')
                getSavedEvents()
                navigate('/')
            })
            .catch((err) => console.log(err))
    }

    const CancelEventDialog = (
        <Dialog
            open={cancelDialogOpen}
            onClose={handleCancelDialogClose}
            aria-labelledby="cancel-event-dialog-title"
            aria-describedby="cancel-event-dialog-description"
        >
            <DialogTitle id="cancel-event-dialog-title">
                {"Cancel this event?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="cancel-event-dialog-description">
                    This event will be deleted, along with its discussion and updates.
                    This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelDialogClose} autoFocus>Go back</Button>
                <Button onClick={handleCancelEvent}>
                    Cancel event
                </Button>
            </DialogActions>
        </Dialog>
    )

    if (error) return (
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h4'>This event doesn't exist!</Typography>
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
                {eventData.primaryImage &&
                    <Box sx={{
                        height: '40vw',
                        maxHeight: '350px',
                        backgroundImage: `url(${primaryImage})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }} />
                }
                {userHostsEvent &&
                    <Box sx={{
                        px: 1,
                        boxSizing: 'border-box',
                        bgcolor: '#81d683',
                    }}>
                        <Stack direction='row' alignItems='center'>
                            <IconButton onClick={handleMenuOpen}>
                                <MoreVertIcon htmlColor="rgba(0, 0, 0, 0.87)" />
                            </IconButton>
                            <Typography color='rgba(0, 0, 0, 0.87)'>
                                You are hosting this event
                            </Typography>
                        </Stack>
                        {HostMenu}
                        {CancelEventDialog}
                    </Box>
                }
                <Box px={isMobile ? 3 : 1.5} pt={isMobile ? 3 : 1.5}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={7}>

                            {/* Event date and saved avatars */}
                            <Stack direction='row' alignItems='center' mb={1.5} flexWrap='wrap'>
                                <Stack direction='row' alignItems='center' width='max-content'>
                                    <EventIcon sx={{ pr: 1, fontSize: '3.2em', transform: 'translateY(0.05em)' }} />

                                    <Stack spacing={-1}>
                                        <Stack direction='row' alignItems='center'>
                                            <Tooltip
                                                title={`Ends ${formattedEndTime} ${formattedEndDate}`}
                                                placement="top"
                                                enterTouchDelay={0}
                                                leaveTouchDelay={3000}>
                                                <Typography fontSize='1.2em'>
                                                    {formattedTime}
                                                </Typography>
                                            </Tooltip>
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
                                    <Stack direction='row' alignItems='center'>
                                        {timeUntilEvent === 'Happening now' && <LiveIndicator />}
                                        <Typography color='text.secondary'>
                                            {timeUntilEvent}
                                        </Typography>
                                    </Stack>
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
                                        <StyledLinkRouter to={`/venues/${venueId._id}`}>
                                            <Typography variant="h6" >
                                                {venueId.name}
                                            </Typography>
                                        </StyledLinkRouter>
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
            <Outlet
                context={{
                    user,
                    eventId: eventData._id,
                    ownerUserId: eventData.venueId.ownerUserId,
                    discussionData,
                    setDiscussionData,
                    updatesData,
                    setUpdatesData
                }} />
        </Container>
    )
}