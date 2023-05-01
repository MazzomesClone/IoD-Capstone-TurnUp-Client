import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useIsSiteInitialised } from '../context/UserContext';

export default function MainSite() {

    const isInitialised = useIsSiteInitialised()

    if (!isInitialised) return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <CircularProgress />
        </Box>
    )

    return (
        <>
            <NavBar />
            <Outlet />
        </>
    )
}
