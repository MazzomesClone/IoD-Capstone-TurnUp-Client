import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link as RouterLink, Outlet, useOutletContext, useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import PlaceIcon from '@mui/icons-material/Place';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import { useCurrentUser, useSavedEvents, useSavedVenues } from '../context/UserContext'
import { TabPack } from '../constructors/TabPack'
import { useRouteMatch } from '../hooks/useRouteMatch'
import GoogleMap from './GoogleMap'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useIsMobile } from '../hooks/useIsMobile'
import MultiEventCards from './MultiEventCards'
import SavedUsersAvatarStack from './SavedUsersAvatarStack'
import SaveIconButton from './SaveIconButton'
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { toast } from 'react-toastify'

function VenueDetails() {

    const isMobile = useIsMobile()

    const { venueData } = useOutletContext()

    const { placeId, description, address, phone, email, website } = venueData

    return (
        <Paper sx={{ mt: 3, width: '100%' }}>
            <Box sx={{ p: isMobile ? 3 : 1.5 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={5}>
                        <Stack>
                            <Typography fontSize='1.2em' gutterBottom>{address}</Typography>
                            <GoogleMap placeId={placeId} />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Stack spacing={3} mx={isMobile ? 3 : 0}>
                            <Typography textAlign='center'>
                                {description}
                            </Typography>
                            {website &&
                                <Stack direction='row' alignItems='center'>
                                    <LanguageIcon />
                                    <Link href={website} target='_blank' rel='noreferrer'>
                                        <Typography fontSize='1.2em' ml={1}>{website}</Typography>
                                    </Link>
                                </Stack>
                            }
                            {phone &&
                                <Stack direction='row' alignItems='center'>
                                    <LocalPhoneIcon />
                                    <Typography fontSize='1.2em' ml={1}>{phone}</Typography>
                                </Stack>
                            }
                            {email &&
                                <Stack direction='row' alignItems='center'>
                                    <EmailIcon />
                                    <Typography fontSize='1.2em' ml={1}>{email}</Typography>
                                </Stack>
                            }
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}

function VenueEvents() {
    const { venueId, venueEvents, setVenueEvents } = useOutletContext()
    const [loading, setLoading] = useState(!venueEvents)
    const [error, setError] = useState(false)

    function getVenueEvents() {
        axios.get(`/api/events/venue/${venueId}`)
            .then(({ data }) => {
                setLoading(false)
                setVenueEvents(data)
            })
            .catch(() => {
                console.log(err.message)
                setError(true)
            })
    }

    useEffect(() => {
        if (!venueEvents) getVenueEvents()
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
        <MultiEventCards eventsData={venueEvents} />
    )
}

export const VenueTabPack = new TabPack(
    'venues/:venueId',
    [
        {
            path: 'events',
            component: <VenueEvents />
        },
        {
            path: 'details',
            component: <VenueDetails />
        }
    ]
)

export default function SingleVenuePage() {

    const navigate = useNavigate()

    const [venueData, setVenueData] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const [venueEvents, setVenueEvents] = useState(null)

    const { isVenueSaved, saveVenue, unsaveVenue } = useSavedVenues(venueData._id)
    const { venueId } = useParams()

    const currentTab = useRouteMatch(VenueTabPack)

    const isMobile = useIsMobile()

    function getVenuePageData() {
        axios.get(`/api/venues/pagedata/${venueId}`)
            .then(({ data }) => {
                setVenueData(data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err.message)
                setError(true)
            })
    }

    useEffect(() => {
        getVenuePageData()
    }, [isVenueSaved])

    const { name, primaryImage, usersThatSaved, addressArray } = venueData

    console.log(venueData)

    const user = useCurrentUser()

    const userOwnsVenue = venueData.ownerUserId === user._id

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
            <MenuItem onClick={() => {
                handleMenuClose()
                handleCancelDialogOpen()
            }}>
                <ListItemIcon>
                    <DeleteIcon />
                </ListItemIcon>
                <ListItemText>
                    Delete venue
                </ListItemText>
            </MenuItem>
        </Menu>
    )

    /* Cancel event dialog */
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
    const handleCancelDialogOpen = () => setCancelDialogOpen(true)
    const handleCancelDialogClose = () => setCancelDialogOpen(false)
    const { getSavedVenues } = useSavedVenues()
    const { getSavedEvents } = useSavedEvents()

    function handleDeleteVenue() {
        handleCancelDialogClose()
        axios.delete(`/api/venues/delete/${venueData._id}`)
            .then(() => {
                toast.success('Venue deleted')
                getSavedVenues()
                getSavedEvents()
                navigate('/hosting')
            })
            .catch((err) => console.log(err))
    }

    const CancelEventDialog = (
        <Dialog
            open={cancelDialogOpen}
            onClose={handleCancelDialogClose}
            aria-labelledby="cancel-venue-dialog-title"
            aria-describedby="cancel-venue-dialog-description"
        >
            <DialogTitle id="cancel-venue-dialog-title">
                {"Delete this venue?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="cancel-event-dialog-description">
                    This venue will be deleted, along with all data for each
                    of its hosted events. This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelDialogClose} autoFocus>Go back</Button>
                <Button onClick={handleDeleteVenue}>
                    Delete venue
                </Button>
            </DialogActions>
        </Dialog>
    )

    if (error) return (
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h4'>This venue doesn't exist!</Typography>
        </Box>
    )

    if (loading) return (
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    )

    return (
        <Container maxWidth='lg'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                m: 0
            }}>
            <Paper sx={{ width: '100%', transition: 'background 0.2s' }}>
                <Box sx={{
                    height: '40vw',
                    maxHeight: '380px',
                    backgroundImage: `url(${primaryImage})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                }} />
                {userOwnsVenue &&
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
                                You own this venue
                            </Typography>
                        </Stack>
                        {HostMenu}
                        {CancelEventDialog}
                    </Box>
                }
                <Box px={isMobile ? 3 : 1.5} pt={isMobile ? 3 : 1.5}>
                    <Stack direction='row' display='flex' justifyContent='space-between' flexWrap='wrap'>

                        {/* Venue name & save */}
                        <Stack direction='row' alignItems='center'>
                            <PlaceIcon fontSize='large' sx={{ pr: 1 }} />
                            <Stack spacing={-0.8}>
                                <Stack direction='row' alignItems='center' spacing={1}>
                                    <Typography variant='h5' fontWeight='500' lineHeight={1}>
                                        {name}
                                    </Typography>
                                    <SaveIconButton
                                        isSaved={isVenueSaved}
                                        handleSave={saveVenue}
                                        handleUnsave={unsaveVenue}
                                        thingToSave='venue'
                                    />
                                </Stack>
                                <Typography color='text.secondary'>
                                    {addressArray[1]}
                                </Typography>
                            </Stack>
                        </Stack>

                        {/* Avatar group */}
                        <Box ml='auto'>
                            <SavedUsersAvatarStack usersThatSaved={usersThatSaved} />
                        </Box>

                    </Stack>

                    {/* Tabs */}
                    <Tabs sx={{ mt: 3 }} value={currentTab} variant='fullWidth' centered >
                        {VenueTabPack.routePathsAndComponents.map(({ path }) =>
                            <Tab label={path} value={path} LinkComponent={RouterLink} to={path} key={path} replace />
                        )}
                    </Tabs>

                </Box>
            </Paper>
            <Outlet context={{ venueData, venueId: venueData._id, venueEvents, setVenueEvents }} />
        </Container >
    )
}
