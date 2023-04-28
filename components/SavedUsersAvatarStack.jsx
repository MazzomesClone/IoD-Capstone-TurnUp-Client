import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AvatarGroup from '@mui/material/AvatarGroup'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'

export default function SavedUsersAvatarStack({ usersThatSaved }) {

    return (
        <Stack sx={{ height: '64px' }}>
            <AvatarGroup max={6}>
                {usersThatSaved.map(({ firstName, lastName, pfp }) =>
                    <Tooltip title={`${firstName} ${lastName}`} key={firstName} placement='top'>
                        <Avatar alt={firstName} src={pfp} />
                    </Tooltip>
                )}
            </AvatarGroup>
            <Typography fontSize='small' color='text.secondary' textAlign='right'>
                {usersThatSaved.length} {usersThatSaved.length === 1 ? 'person' : 'people'} saved
            </Typography>
        </Stack>
    )
}