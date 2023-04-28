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
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

// AccountDrawer
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import EventIcon from '@mui/icons-material/Event';
import FestivalIcon from '@mui/icons-material/Festival';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useCurrentUser, useHandleLogout } from '../context/UserContext';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import { Link as LinkRouter } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

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
        marginLeft: theme.spacing(1),
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
        //transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '40ch',
        },
    },
}));

export default function NavBar() {

    const user = useCurrentUser()

    const [isOpen, setIsOpen] = useState(false)
    const openDrawer = () => setIsOpen(true)

    const isMobile = useIsMobile()

    const Logo = (isMobile &&
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Typography variant='h6' fontWeight='bold'>TurnUp</Typography>
        </Box>
    )

    const SearchBar = (
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 2, justifyContent: 'center' }}>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                />
            </Search>
        </Box>
    )

    const ProfilePic = (
        <Box sx={{ display: 'flex', alignItems: 'center', flex: (isMobile) && 1, justifyContent: 'flex-end' }}>
            {user ?
                <Tooltip title='Menu'>
                    <IconButton color='inherit' onClick={user && openDrawer}>
                        <Avatar src={user?.pfp ? user.pfp : ''} />
                    </IconButton>
                </Tooltip>
                :
                <Box sx={{
                    py: 0.5,
                    px: 2,
                    borderRadius: 2,
                    transition: 'background 0.1s',
                    ":hover": {
                        backgroundColor: '#ffffff40'
                    }
                }}>
                    <ButtonBase LinkComponent={LinkRouter} to='/signin'>
                        <Stack direction='row' alignItems='center'>
                            <Typography variant='h6' mr={1} >
                                Sign in
                            </Typography>
                            <LoginIcon fontSize='large' />
                        </Stack>
                    </ButtonBase>
                </Box>
            }
        </Box>
    )

    return (
        <>
            <AppBar position="static" sx={{ transition: 'background 0.2s' }}>
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
            icon: <BookmarkAddedIcon />
        },
        {
            label: 'Saved venues',
            icon: <WhereToVoteIcon />
        },
        {
            label: 'Hosted events',
            icon: <EventIcon />
        },
        {
            label: 'Owned venues',
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
            <ListItemButton>
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