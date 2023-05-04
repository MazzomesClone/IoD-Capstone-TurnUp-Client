import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useIsMobile } from "../hooks/useIsMobile"
import { useSavedVenues } from "../context/UserContext"
import PlaceIcon from '@mui/icons-material/Place';
import { StyledLinkRouter } from "./StyledLinkRouter";
import { Link as LinkRouter } from 'react-router-dom'
import SaveIconButton from "./SaveIconButton";
import { useTheme } from "@mui/material";

function VenueCard({ venueData }) {

    const theme = useTheme()

    const { isVenueSaved, saveVenue, unsaveVenue } = useSavedVenues(venueData._id)

    const { name, addressArray, primaryImage } = venueData

    const city = addressArray[2].split(' ')[0]

    return (
        <Grid item xs={12} md={6}>
            <Paper>
                <LinkRouter to={`/venues/${venueData._id}`}>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Box sx={{
                            height: '40vw',
                            maxHeight: '280px',
                            backgroundImage: `url(${primaryImage})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            background: !primaryImage && `linear-gradient(to bottom, ${theme.palette.primary.main}, transparent)`,
                            transition: 'opacity 0.5s, transform 0.5s',
                            cursor: 'pointer',
                            ":hover": {
                                opacity: 0.9,
                                transform: 'scale(1.02)'
                            }
                        }} />
                    </Box>
                </LinkRouter>
                <Box sx={{ p: 1.5, pb: 2 }}>

                    {/* Event name & save */}
                    <Stack direction='row' alignItems='center'>
                        <PlaceIcon sx={{ pr: 1 }} />
                        <Stack spacing={-0.8}>
                            <Stack direction='row' alignItems='center' spacing={1}>
                                <StyledLinkRouter to={`/venues/${venueData._id}`}>
                                    <Typography variant='h6' fontWeight='500' lineHeight={1}>
                                        {name}
                                    </Typography>
                                </StyledLinkRouter>
                                <SaveIconButton isSaved={isVenueSaved}
                                    handleSave={saveVenue}
                                    handleUnsave={unsaveVenue}
                                    thingToSave='venue'
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                    <Typography color='text.secondary'>
                        {addressArray[1]} - {city}
                    </Typography>
                </Box>
            </Paper>
        </Grid>
    )
}

export default function MultiVenueCards({ venuesData }) {

    const isMobile = useIsMobile()

    const VenueCards = venuesData?.map((venue, index) => <VenueCard venueData={venue} key={index}/>)

    if (venuesData?.length === 0) return (
        <Typography color='text.secondary' mt={3} textAlign='center'>
            No venues
        </Typography>
    )

    return (
        <Grid container spacing={3} mt={1} mb={2} px={isMobile ? 3 : 0}>
            {VenueCards}
        </Grid>
    )
}