import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react'

export default function MainSite() {

    const [loading, setLoading] = useState(false)

    if (loading) return (
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
