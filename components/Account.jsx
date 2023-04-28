import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import PersonIcon from '@mui/icons-material/Person';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Button from '@mui/material/Button'
import { useState } from 'react'
import axios from 'axios'
import { useCurrentUser } from '../context/UserContext'
import { useImageUpload } from '../hooks/useImageUpload'

export default function Account() {

    const user = useCurrentUser()

    const { img, handleImgChange } = useImageUpload()
    const [hasChanges, setHasChanges] = useState(false)

    function handleChange(e) {
        handleImgChange(e)
        setHasChanges(true)
    }

    async function handleEditSubmit(e) {
        e.preventDefault()
        const editData = new FormData(e.target)
        console.log(editData)
        try {
            await axios.put('/api/users/edit', editData)
            window.location.reload()
        } catch (err) {
            console.log(err.message)
        }
    }

    return (
        <Container maxWidth='md' sx={{ pt: 3 }}>
            <Paper sx={{ p: 3, transition: 'background 0.2s' }}>
                <Stack spacing={3}>
                    <Typography variant='h4' fontWeight='500' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {user?.firstName} {user?.lastName}
                    </Typography>
                    <Divider />
                    <Stack direction='row' alignItems='center'>
                        <PersonIcon />
                        <Typography variant='h5' display="inline" px={1}>
                            Edit profile:
                        </Typography>
                    </Stack>
                    <Box component='form' onSubmit={handleEditSubmit} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Stack>
                            <Box sx={{
                                borderColor: 'text.secondary',
                                borderWidth: '2px',
                                borderStyle: 'solid',
                                borderRadius: '8px',
                                width: '150px',
                                height: '150px',
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                backgroundImage: img.preview ? `url(${img.preview})` : `url(${user?.pfp})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}>
                            </Box>
                            <Button component="label" endIcon={<PhotoCamera />}>
                                Change pic
                                <input hidden name='file' accept="image/*" type="file" onChange={handleChange} />
                            </Button>
                            <Button variant='contained' type='submit' disabled={!hasChanges}>Save changes</Button>
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        </Container >
    )
}
