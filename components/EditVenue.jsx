import { Box, Button, Container, Divider, Grid, Paper, Stack, TextField } from "@mui/material";
import { useFormControl } from "../hooks/useFormControl";
import { useImageUpload } from "../hooks/useImageUpload";
import { useIsMobile } from "../hooks/useIsMobile";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import Typography from '@mui/material/Typography'
import axios from "axios";
import { toast } from "react-toastify";
import { useCurrentUser } from "../context/UserContext";

export default function EditVenue() {
    const navigate = useNavigate()
    const goBack = () => navigate(-1, { replace: true })

    const isMobile = useIsMobile()
    const user = useCurrentUser()

    const [venueData, setVenueData] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const { venueId } = useParams()

    const { inputProps: nameProps, setValue: setNameValue } = useFormControl('')
    const { inputProps: phoneProps, setValue: setPhoneValue } = useFormControl('')
    const { inputProps: emailProps, setValue: setEmailValue } = useFormControl('')
    const { inputProps: websiteProps, setValue: setWebsiteValue } = useFormControl('')
    const { inputProps: descriptionProps, setValue: setDescriptionValue } = useFormControl('')
    const { img, handleImgChange, setImg } = useImageUpload()

    async function getVenueEditData() {
        try {
            const { data: venueData } = await axios.get(`/api/venues/pagedata/${venueId}`)
            setVenueData(venueData)

            return venueData
        } catch (err) {
            console.log(err)
            setError(true)
        }
    }

    function loadExistingVenueData(data) {
        const { description, phone, email, website, name, primaryImage } = data
        setNameValue(name)
        setDescriptionValue(description)
        setPhoneValue(phone)
        setEmailValue(email)
        setWebsiteValue(website)
        setImg({ preview: primaryImage, data: '' })
    }

    useEffect(() => {
        getVenueEditData()
            .then((venueData) => {
                if (venueData.ownerUserId !== user._id) {
                    navigate(`/venues/${venueId}`, { replace: true })
                }
                loadExistingVenueData(venueData)
                setLoading(false)
            })
            .catch(err => console.log(err))
    }, [])

    function handleImgRestore() {
        setImg({ preview: venueData.primaryImage, data: '' })
    }

    function handleSubmit() {

        const venueEditData = {
            data: {
                name: nameProps.value,
                email: emailProps.value,
                phone: phoneProps.value,
                website: websiteProps.value,
                description: descriptionProps.value
            },
            file: img.data
        }

        axios.put(`/api/venues/edit/${venueId}`, venueEditData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                toast.success('Changes saved')
                navigate(`/venues/${venueId}/details`)
            })
            .catch(err => console.log(err))
    }

    if (error) return (
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h4'>Error editing venue</Typography>
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
                        <Button component="label" endIcon={<SettingsBackupRestoreIcon />} onClick={handleImgRestore}>
                            Revert image
                        </Button>
                    }
                </Stack>
                <Divider />
                <Box p={isMobile ? 3 : 1.5}>
                    <Grid container spacing={3}>
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
                    <Grid container spacing={3} mt={3}>
                        <Grid item xs={12} sm={6} display='flex'>
                            <Button
                                sx={{ width: '100%', maxWidth: '25em', mx: 'auto' }}
                                size='large'
                                variant='outlined'
                                onClick={() => loadExistingVenueData(venueData)}
                            >
                                Revert changes
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} display='flex'>
                            <Button
                                sx={{ width: '100%', maxWidth: '25em', mx: 'auto' }}
                                size='large'
                                variant='contained'
                                disabled={!nameProps.value}
                                onClick={handleSubmit}
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container >
    )
}