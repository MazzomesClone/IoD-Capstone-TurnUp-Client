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
                <Stack spacing={3} alignItems='flex-start'>
                    <Typography variant='h4' fontWeight='500' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <SettingsIcon fontSize='inherit' sx={{ pr: 1 }} />
                        Settings
                    </Typography>
                    <Divider />
                    <Stack direction='row' alignItems='center'>
                        <DarkModeIcon />
                        <Typography variant='h5' display="inline" px={1}>
                            User theme:
                        </Typography>
                        <ToggleThemeButton />
                    </Stack>
                    <Button variant='contained' onClick={handleSubmit}>
                        Save settings
                    </Button>
                </Stack>
            </Paper>
        </Container >
    )
}
