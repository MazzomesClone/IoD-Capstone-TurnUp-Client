// NavBar
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import PlaceIcon from '@mui/icons-material/Place';
import Avatar from '@mui/material/Avatar';
import { UnstyledLinkRouter } from './StyledLinkRouter'
import Autocomplete from '@mui/material/Autocomplete';
import { debounce } from '@mui/material/utils';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

// AccountDrawer
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import EventIcon from '@mui/icons-material/Event';
import FestivalIcon from '@mui/icons-material/Festival';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import { useMemo, useState } from 'react';
import { useCurrentUser, useHandleLogout } from '../context/UserContext';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import { Link as LinkRouter, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import { formatDate } from '../utils/formatDate';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export default function NavBar() {

    const user = useCurrentUser()

    const navigate = useNavigate()

    const [isOpen, setIsOpen] = useState(false)
    const openDrawer = () => setIsOpen(true)

    const isMobile = useIsMobile()

    const [value, setValue] = useState(null)
    const [inputValue, setInputValue] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const searchResultPropToMatch = 'name'

    async function getSearchResults(searchQuery) {
        try {
            const { data } = await axios.get(`/api/search/${searchQuery}`)
            setSearchResults(data)
        } catch (err) {
            console.log(err.message)
        }
    }

    const debouncedGetSearchResults = useMemo(() => debounce((query) => getSearchResults(query), 400), [])

    const Logo = (
        <Box sx={{ display: 'flex', alignItems: 'center', flex: isMobile ? 1 : 0, pr: 2 }}>
            <UnstyledLinkRouter to='/browse'>
                <Typography fontFamily='Pacifico' component='h1' fontSize='1.8em' mb={0.8}>{isMobile ? 'TurnUp' : 'T'}</Typography>
            </UnstyledLinkRouter>
        </Box>
    )

    const SearchBar = (
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 2.5, justifyContent: 'center' }}>
            <Autocomplete
                sx={{ width: '100%', maxHeight: '50px', maxWidth: '700px' }}
                clearOnEscape
                noOptionsText='No results'
                options={searchResults}
                getOptionLabel={(option) => option[searchResultPropToMatch]}
                renderInput={(params) => {
                    const { InputLabelProps, InputProps, ...rest } = params
                    return (
                        <Search sx={{ width: '100%' }}>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search"
                                {...InputLabelProps}
                                {...InputProps}
                                {...rest}
                            />
                        </Search>
                    )
                }}
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue)
                    if (newValue === '') setSearchResults([])
                    const type = newValue.placeId ? 'venues' : 'events'
                    navigate(`/${type}/${newValue._id}`)
                }}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue)
                    if (newInputValue === '') return setSearchResults([])
                    debouncedGetSearchResults(newInputValue)
                }}
                inputValue={inputValue}
                renderOption={(props, option, { inputValue }) => {
                    const matches = match(option[searchResultPropToMatch], inputValue, { insideWords: true });
                    const parts = parse(option[searchResultPropToMatch], matches);
                    const type = option.placeId ? 'venues' : 'events'
                    const { formattedDate } = formatDate(option.date)

                    return (
                        <li {...props}>
                            <Grid container alignItems="center">
                                <Grid item sx={{ display: 'flex', width: 44 }}>
                                    {type === 'venues' ? <PlaceIcon /> : <EventIcon />}
                                </Grid>
                                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                    {parts.map((part, index) => (
                                        <Box
                                            key={index}
                                            component="span"
                                            sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                                        >
                                            {part.text}
                                        </Box>
                                    ))}
                                    <Typography variant="body2" color="text.secondary">
                                        {type === 'venues' ? option.addressArray[1] : formattedDate}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
        </Box>
    )

    const ProfilePic = (
        <Box sx={{ display: 'flex', alignItems: 'center', flex: isMobile ? 1 : 0, justifyContent: 'flex-end' }}>
            {user ?
                <Tooltip title='Menu'>
                    <IconButton color='inherit' onClick={user && openDrawer}>
                        <Avatar src={user?.pfp ? user.pfp : ''} />
                    </IconButton>
                </Tooltip>
                :
                <Tooltip title='Sign in'>
                    <IconButton color='inherit' LinkComponent={LinkRouter} to='/signin'>
                        <LoginIcon fontSize='large' />
                    </IconButton>
                </Tooltip>
            }
        </Box>
    )

    return (
        <>
            <AppBar position="sticky" sx={{ transition: 'background 0.2s', zIndex: 2, top: 0 }}>
                <Toolbar sx={{ display: 'flex' }}>
                    {Logo}
                    {SearchBar}
                    {ProfilePic}
                </Toolbar>
            </AppBar>
            <AccountDrawer isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
        </>
    )
}

function AccountDrawer({ isOpen, setIsOpen, user }) {

    const openDrawer = () => setIsOpen(true)
    const closeDrawer = () => setIsOpen(false)

    const handleLogout = useHandleLogout()

    const userPages = [
        {
            label: 'Saved events',
            icon: <EventAvailableIcon />
        },
        {
            label: 'Saved venues',
            icon: <WhereToVoteIcon />
        },
        {
            label: 'Hosting',
            icon: <FestivalIcon />
        },
    ]

    const accountPages = [
        {
            label: 'Settings',
            icon: <SettingsIcon />,
            href: 'settings'
        },
        {
            label: 'Sign out',
            icon: <LogoutIcon />,
            onClick: handleLogout
        }
    ]

    const accountButton = (
        <ButtonBase
            LinkComponent={LinkRouter}
            to='/account'
            sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                m: 1,
                py: 1,
                pl: 2.1,
                borderRadius: '5px',
                transition: 'background 0.1s',
                ":hover": {
                    backgroundColor: 'action.hover',
                    cursor: 'pointer'
                }
            }}>
            <Stack direction='row' alignItems='center' spacing={2.7}>
                <Avatar src={user?.pfp ? user.pfp : ''} />
                <Typography variant='h6' component='p' sx={{ opacity: '0.8' }}>{user?.firstName} {user?.lastName}</Typography>
            </Stack>
        </ButtonBase>
    )

    const userItems = userPages.map(({ label, icon }) =>
        <ListItem key={label}>
            <ListItemButton LinkComponent={LinkRouter} to={label.split(' ').join('').toLowerCase()}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={label} />
            </ListItemButton>
        </ListItem>
    )

    const accountItems = accountPages.map(({ label, icon, onClick, href }) =>
        <ListItem key={label}>
            <ListItemButton LinkComponent={LinkRouter} onClick={onClick} to={href}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={label} />
            </ListItemButton>
        </ListItem>
    )

    return (
        <SwipeableDrawer
            anchor='right'
            open={isOpen}
            onClose={closeDrawer}
            onOpen={openDrawer}
            disableSwipeToOpen={!user}
        >
            <Box onClick={closeDrawer}
                sx={{
                    minWidth: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}>
                {accountButton}
                <Divider />
                <List>
                    {userItems}
                </List>
                <Divider sx={{ mt: 'auto' }} />
                <List>
                    {accountItems}
                </List>
            </Box>
        </SwipeableDrawer>
    )
}