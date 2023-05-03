import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import SettingsIcon from '@mui/icons-material/Settings';
import Stack from '@mui/material/Stack'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { ToggleThemeButton, useIsDarkMode } from '../theme/ThemeProvider'
import axios from 'axios';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';

export default function Settings() {

    const isDarkMode = useIsDarkMode()

    function handleSubmit() {

        const newSettingsData = {
            data: {
                themeMode: isDarkMode ? 'dark' : 'light'
            }
        }

        axios.put('/api/users/edit', newSettingsData)
            .then(() => {
                toast.success('Settings saved!')
            })
            .catch(err => console.log(err))
    }

    return (
        <Container maxWidth='md' sx={{ pt: 3 }}>
            <Paper sx={{ p: 3, transition: 'background 0.2s' }}>
                <Stack spacing={3} /* alignItems='flex-start' */>
                    <Stack direction='row' alignItems='center' justifyContent='center'>

                        <SettingsIcon sx={{ fontSize: '2em' }} />
                        <Typography variant='h4'>

                            Settings
                        </Typography>

                    </Stack>
                    <Divider />
                    <Stack direction='row' alignItems='center'>
                        <DarkModeIcon />
                        <Typography variant='h5' display="inline" px={1}>
                            User theme:
                        </Typography>
                        <ToggleThemeButton />
                    </Stack>
                    <Box sx={{ width: '250px', display: 'flex', justifyContent: 'center' }} alignSelf='center' justifyContent='center'>
                        <Button variant='contained' onClick={handleSubmit}>
                            Save settings
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Container >
    )
}
