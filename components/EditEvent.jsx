import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid'
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../context/UserContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { useFormControl } from "../hooks/useFormControl";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import dayjs from 'dayjs';
import { useImageUpload } from "../hooks/useImageUpload";
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { DateTimePicker } from "@mui/x-date-pickers";
import SelectVenue from "./SelectVenue";

export default function EditEvent() {

    const navigate = useNavigate()
    const goBack = () => navigate(-1, { replace: true })

    const [eventData, setEventData] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const { eventId } = useParams()

    const now = dayjs(new Date())

    const [ownedVenues, setOwnedVenues] = useState([])
    const [venue, setVenue] = useState(null)
    const { inputProps: nameProps, setValue: setName } = useFormControl('')
    const { inputProps: descriptionProps, setValue: setDescription } = useFormControl('')
    const [newDate, setNewDate] = useState(now)
    const [newEndDate, setNewEndDate] = useState(now)
    const { img, handleImgChange, setImg } = useImageUpload()

    const isEndDateInvalid = newEndDate < newDate

    const isMobile = useIsMobile()
    const user = useCurrentUser()

    async function getEventEditData() {
        try {
            const { data: eventData } = await axios.get(`/api/events/pagedata/${eventId}`)
            setEventData(eventData)

            const { data: ownedVenues } = await axios.get('/api/venues/owned')
            setOwnedVenues(ownedVenues)

            return { eventData, ownedVenues }
        } catch (err) {
            console.log(err)
            setError(true)
        }
    }

    useEffect(() => {
        getEventEditData()
            .then(({ eventData, ownedVenues }) => {
                if (eventData.venueId.ownerUserId !== user._id) {
                    navigate(`/events/${eventId}`, { replace: true })
                }
                loadExistingEventData(eventData, ownedVenues)
                setLoading(false)
            })
    }, [])

    function loadExistingEventData(data, ownedVenues) {
        const { name, date, endDate, primaryImage, description } = data
        setVenue(ownedVenues.find(venue => venue._id === data.venueId._id))
        setName(name)
        setNewDate(dayjs(date))
        setNewEndDate(dayjs(endDate))
        setDescription(description)
        setImg({ preview: primaryImage, data: '' })
    }

    function handleImgRestore() {
        setImg({ preview: eventData.primaryImage, data: '' })
    }

    function handleSubmit() {

        const eventEditData = {
            data: {
                venueId: venue._id,
                name: nameProps.value,
                date: newDate.format(),
                endDate: newEndDate.format(),
                description: descriptionProps.value
            },
            file: img.data
        }

        axios.put(`/api/events/edit/${eventId}`, eventEditData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                toast.success('Changes saved')
                navigate(`/events/${eventId}`)
            })
            .catch(err => console.log(err))

    }

    if (error) return (
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h4'>Error editing event</Typography>
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
                    display: 'flex',
                    p: isMobile ? 3 : 1.5
                }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={goBack}>
                        Go back
                    </Button>
                </Box>
                {img.preview &&
                    <Box sx={{
                        height: '40vw',
                        maxHeight: '350px',
                        backgroundImage: img.preview ? `url(${img.preview})` : '',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }} />
                }
                <Divider />
                <Stack direction='row' justifyContent='center' my={3}>
                    <Button component="label" endIcon={<PhotoCamera />}>
                        {img.preview ? 'Change image' : 'Upload image'}
                        <input hidden name='file' accept="image/*" type="file" onChange={handleImgChange} />
                    </Button>
                    {img.preview &&
                        <Button component="label" endIcon={<SettingsBackupRestoreIcon />} onClick={handleImgRestore}>
                            Revert image
                        </Button>
                    }
                </Stack>
                <Divider />
                <Box px={isMobile ? 3 : 1.5} pt={isMobile ? 3 : 1.5}>
                    <Stack>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={7}>

                                {/* Event date and saved avatars */}
                                <Stack direction='row' justifyContent='center' mb={1.5} flexWrap='wrap'>
                                    <DateTimePicker
                                        ampm
                                        format="DD/MM/YYYY h:mm A"
                                        timezone='browser'
                                        minDateTime={now}
                                        sx={{ width: '220px', m: 0.5 }}
                                        value={newDate}
                                        onChange={(value) => {
                                            setNewDate(value)
                                            setNewEndDate(value)
                                        }}
                                        label='Start'
                                    />
                                    <DateTimePicker
                                        ampm
                                        format="DD/MM/YYYY h:mm A"
                                        sx={{ width: '220px', m: 0.5 }}
                                        value={newEndDate}
                                        minDateTime={newDate}
                                        onChange={(value) => setNewEndDate(value)}
                                        label='End'
                                    />
                                </Stack>

                                <Divider />

                                {/* Event name */}
                                <Stack direction='row' alignItems='center' mb={1} mt={2}>
                                    <TextField fullWidth variant='standard' label='Event name' required {...nameProps} />
                                </Stack>

                                {/* Description */}
                                <TextField multiline fullWidth rows={7} variant='standard' label='Description' {...descriptionProps} />

                            </Grid>

                            {/* Venue and Map */}
                            <Grid item xs={12} md={5}>
                                <Stack spacing={2}>
                                    <SelectVenue venue={venue} setVenue={setVenue} options={ownedVenues} label='name' />
                                    <Box>
                                        {venue &&
                                            venue.addressArray.map(line =>
                                                <Typography gutterBottom sx={{ fontSize: '1.1em', fontWeight: '500' }} key={line}>
                                                    {line}
                                                </Typography>
                                            )
                                        }
                                    </Box>
                                </Stack>
                            </Grid>

                        </Grid>
                        <Grid container spacing={3} my={3}>
                            <Grid item xs={12} sm={6} display='flex'>
                                <Button
                                    sx={{ width: '100%', maxWidth: '25em', mx: 'auto' }}
                                    size='large'
                                    variant='outlined'
                                    onClick={() => loadExistingEventData(eventData, ownedVenues)}
                                >
                                    Revert changes
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} display='flex'>
                                <Button
                                    sx={{ width: '100%', maxWidth: '25em', mx: 'auto' }}
                                    size='large'
                                    variant='contained'
                                    disabled={!venue || !nameProps.value || isEndDateInvalid}
                                    onClick={handleSubmit}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    )
}