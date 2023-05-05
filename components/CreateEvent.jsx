import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useEffect, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import { useFormControl } from '../hooks/useFormControl';
import axios from 'axios';
import { useImageUpload } from '../hooks/useImageUpload';
import { useNavigate } from 'react-router-dom';
import EventNote from '@mui/icons-material/EventNote';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import SelectVenue from './SelectVenue';

export default function CreateEvent() {

    const navigate = useNavigate()

    const isMobile = useIsMobile()

    const [ownedVenues, setOwnedVenues] = useState([])
    const [venue, setVenue] = useState(null)

    const now = dayjs()

    const { inputProps: nameProps } = useFormControl('')
    const { inputProps: descriptionProps } = useFormControl('')
    const [date, setDate] = useState(now.add(1, 'minute'))
    const [endDate, setEndDate] = useState(now.add(1, 'minute').add(1, 'hour'))
    const { img, handleImgChange, setImg } = useImageUpload()

    const isEndDateInvalid = endDate.format() < date.format() || date < now

    useEffect(() => {
        axios.get('/api/venues/owned')
            .then(({ data }) => setOwnedVenues(data))
            .catch(err => console.log(err.message))
    }, [])

    function handleImgRemove() {
        setImg({ preview: '', data: '' })
    }

    function handleSubmit() {
        const newEventData = {
            data: {
                venueId: venue._id,
                name: nameProps.value,
                date: date.format(),
                endDate: endDate.format(),
                description: descriptionProps.value
            },
            file: img.data
        }
        axios.post('/api/events/new', newEventData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(({ data }) => {
                toast.success('Event created!')
                navigate(`/events/${data.newId}`)
            })
            .catch(err => console.log(err))
    }

    return (
        <Container maxWidth='md'>
            <Paper sx={{ mt: 3 }}>
                <Box p={isMobile ? 3 : 1.5}>
                    <Stack spacing={2}>
                        <Stack direction='row'>
                            <EventNote />
                            <Typography variant='h5' ml={1}>
                                Create Event
                            </Typography>
                        </Stack>
                        <Divider />
                        <Grid container>
                            <Grid item xs={12} sm={6} pr={2}>
                                <Stack spacing={2}>
                                    <Typography variant='h6' >
                                        Select from your venues:
                                    </Typography>
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
                            <Grid item xs={12} sm={6} pr={2}>
                                <Stack spacing={2}>
                                    <TextField disabled={!venue} fullWidth variant='standard' label='Event name' required {...nameProps} />
                                    <TextField disabled={!venue} multiline rows={7} variant='standard' label='Description' {...descriptionProps} />
                                </Stack>
                            </Grid>
                        </Grid>
                        {venue &&
                            <Stack>
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
                                        <Button component="label" endIcon={<DeleteIcon />} onClick={handleImgRemove}>
                                            Clear image
                                        </Button>
                                    }
                                </Stack>
                                <Divider />
                                <Grid container spacing={2} mt={1} mb={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={2}>
                                            <Typography variant='h6' >
                                                When does it start?
                                            </Typography>
                                            <DateTimePicker
                                                ampm
                                                format="DD/MM/YYYY h:mm A"
                                                minDateTime={now}
                                                value={date}
                                                onChange={(value) => {
                                                    setDate(value)
                                                    if (value > endDate) setEndDate(value)
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={2.3}>
                                            <Typography variant='h6' >
                                                When does it finish?
                                            </Typography>
                                            <DateTimePicker
                                                ampm
                                                format="DD/MM/YYYY h:mm A"
                                                value={endDate}
                                                minDateTime={date}
                                                onChange={(value) => setEndDate(value)}
                                            />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Stack>
                        }
                        <Button
                            sx={{ width: '100%', maxWidth: '25em', alignSelf: 'center' }}
                            size='large'
                            variant='contained'
                            disabled={!venue || !nameProps.value || isEndDateInvalid}
                            onClick={handleSubmit}
                        >
                            Create event
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    )
}