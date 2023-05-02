import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useEffect, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import GoogleLocationPicker from './GoogleLocationPicker';
import GoogleMap from './GoogleMap';
import { useFormControl } from '../hooks/useFormControl';
import axios from 'axios';
import { useImageUpload } from '../hooks/useImageUpload';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CreateVenue() {

    const navigate = useNavigate()

    const isMobile = useIsMobile()

    const [venueExists, setVenueExists] = useState(true)
    const [locationResult, setLocatioResult] = useState(null)

    const { inputProps: nameProps, setValue: setNameValue } = useFormControl('')
    const { inputProps: phoneProps } = useFormControl('')
    const { inputProps: emailProps } = useFormControl('')
    const { inputProps: websiteProps } = useFormControl('')
    const { inputProps: descriptionProps } = useFormControl('')
    const { img, handleImgChange, setImg } = useImageUpload()

    useEffect(() => {
        if (locationResult) {
            axios.get(`/api/venues/check/${locationResult.placeId}`)
                .then(() => {
                    setVenueExists(false)
                    setNameValue(locationResult.name)
                })
                .catch(() => setVenueExists(true))
        }
    }, [locationResult])

    function handleImgRemove() {
        setImg({ preview: '', data: '' })
    }

    function handleSubmit() {
        const newVenueData = {
            data: {
                ...locationResult,
                name: nameProps.value,
                email: emailProps.value,
                phone: phoneProps.value,
                website: websiteProps.value,
                description: descriptionProps.value
            },
            file: img.data
        }
        axios.post('/api/venues/new', newVenueData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(({ data }) => {
                toast.success('Venue created!')
                navigate(`/venues/${data.newId}`)
            })
            .catch(err => console.log(err))
    }

    return (
        <Container maxWidth='lg'>
            <Paper sx={{ mt: 3 }}>
                <Box p={isMobile ? 3 : 1.5}>
                    <Stack spacing={2}>
                        <Stack direction='row'>
                            <AddLocationAltIcon />
                            <Typography variant='h5' ml={1}>
                                Create Venue
                            </Typography>
                        </Stack>
                        <Divider />
                        <Grid container>
                            <Grid item xs={12} sm={6} pr={2}>
                                <Stack spacing={2}>
                                    <Typography variant='h6' >
                                        Search for a location:
                                    </Typography>
                                    <GoogleLocationPicker setResult={setLocatioResult} />
                                    {locationResult &&
                                        <>
                                            {venueExists ?
                                                <Typography color='error.main'>
                                                    This venue has already been created
                                                </Typography>
                                                :
                                                <Typography color='success.main'>
                                                    This venue is available
                                                </Typography>
                                            }
                                        </>
                                    }
                                    {locationResult &&
                                        <Stack>
                                            {locationResult.addressArray.map(line =>
                                                <Typography gutterBottom sx={{ fontSize: '1.1em', fontWeight: '500' }} key={line}>
                                                    {line}
                                                </Typography>
                                            )}
                                            {!venueExists &&
                                                <Typography fontStyle='italic' color='text.secondary'>
                                                    Once created, the location of this venue may not be changed
                                                </Typography>
                                            }
                                        </Stack>
                                    }
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <GoogleMap placeId={locationResult?.placeId} />
                            </Grid>
                        </Grid>
                        {!venueExists &&
                            <Stack>
                                {img.preview &&
                                    <Box sx={{
                                        height: '40vw',
                                        maxHeight: '380px',
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
                                            <TextField fullWidth variant='standard' label='Venue name' required {...nameProps} />
                                            <TextField multiline rows={4} variant='standard' label='Description' {...descriptionProps} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={2.3}>
                                            <TextField fullWidth variant='standard' label='Email' {...emailProps} />
                                            <TextField fullWidth variant='standard' label='Phone' {...phoneProps} />
                                            <TextField fullWidth variant='standard' label='Website' {...websiteProps} />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Stack>
                        }
                        <Button
                            sx={{ width: '100%', maxWidth: '25em', alignSelf: 'center' }}
                            size='large'
                            onClick={handleSubmit}
                            disabled={venueExists || !nameProps.value}
                            variant='contained'
                        >
                            Create venue
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    )
}
