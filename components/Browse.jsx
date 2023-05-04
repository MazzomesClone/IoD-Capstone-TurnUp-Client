import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Outlet, useOutletContext } from "react-router-dom";
import MultiEventCards from "./MultiEventCards";
import { useEffect, useState } from "react";
import axios from "axios";
import { TabPack } from "../constructors/TabPack";
import { useRouteMatch } from "../hooks/useRouteMatch";
import { Link as RouterLink } from 'react-router-dom'
import MultiVenueCards from "./MultiVenueCards";
import EventDateFilter from "./EventDateFilter";
import PlaceIcon from '@mui/icons-material/Place';
import EventIcon from '@mui/icons-material/Event';

function BrowseEvents() {

    const { eventsData, setEventsData } = useOutletContext()
    const [filteredEventsData, setFilteredEventsData] = useState(eventsData)

    const [loading, setLoading] = useState(!eventsData)

    function getAllEvents() {
        axios.get('/api/events/all')
            .then(({ data }) => {
                setEventsData(data)
                setLoading(false)
            })
            .catch(err => console.log(err.message))
    }

    useEffect(() => {
        if (!eventsData) getAllEvents()
    }, [])

    if (loading) return (
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    )

    return (
        <>
            <EventDateFilter minDateNow={true} eventsData={eventsData} setFilteredEventsData={setFilteredEventsData} />
            <MultiEventCards eventsData={filteredEventsData} />
        </>
    )
}

function BrowseVenues() {

    const { venuesData, setVenuesData } = useOutletContext()

    const [loading, setLoading] = useState(!venuesData)

    function getAllEvents() {
        axios.get('/api/venues/all')
            .then(({ data }) => {
                setVenuesData(data)
                setLoading(false)
            })
            .catch(err => console.log(err.message))
    }

    useEffect(() => {
        if (!venuesData) getAllEvents()
    }, [])

    if (loading) return (
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    )

    return (
        <>
            <MultiVenueCards venuesData={venuesData} />
        </>
    )
}

export const BrowseTabPack = new TabPack(
    'browse',
    [
        {
            path: 'events',
            component: <BrowseEvents />,
            icon: <EventIcon />
        },
        {
            path: 'venues',
            component: <BrowseVenues />,
            icon: <PlaceIcon />
        }
    ]
)

export default function Browse() {

    const [eventsData, setEventsData] = useState(null)
    const [venuesData, setVenuesData] = useState(null)

    const currentTab = useRouteMatch(BrowseTabPack)

    return (
        <Container maxWidth='lg' sx={{ pt: 3 }}>
            <Paper sx={{ p: 3, transition: 'background 0.2s' }}>
                <Stack direction='row' justifyContent='space-between' flexWrap='wrap'>
                    <Stack direction='row' alignItems='center'>
                        <LibraryBooksIcon />
                        <Typography /* fontFamily='Pacifico' */ variant="h5" ml={1}>
                            Discover
                        </Typography>
                    </Stack>

                    {/* Tabs */}
                    <Tabs value={currentTab} >
                        {BrowseTabPack.routePathsAndComponents.map(({ path, icon }) =>
                            <Tab icon={icon} iconPosition="start" label={path} value={path} LinkComponent={RouterLink} to={path} key={path} replace />
                        )}
                    </Tabs>
                </Stack>
            </Paper>
            <Outlet context={{ eventsData, setEventsData, venuesData, setVenuesData }} />
        </Container >
    )
}