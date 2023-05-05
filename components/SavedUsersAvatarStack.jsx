import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AvatarGroup from '@mui/material/AvatarGroup'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import List from '@mui/material/List'
import { ListItem } from '@mui/material'

export default function SavedUsersAvatarStack({ usersThatSaved }) {

    return (
        <Stack sx={{ height: '64px' }}>
            <AvatarGroup max={4}>
                {usersThatSaved.map(({ firstName, pfp }, index) =>
                    <Avatar alt={firstName} src={pfp} key={index} />
                )}
            </AvatarGroup>
            <Tooltip
                enterTouchDelay={0}
                leaveTouchDelay={3000}
                title={
                    <>
                        {usersThatSaved.length === 0 ?
                            <Typography fontStyle='italic' sx={{ fontSize: '1.1em' }}>
                                No saves yet
                            </Typography>
                            :
                            <List sx={{ mx: -1 }}>
                                {usersThatSaved.map(({ firstName, lastName }, index) =>
                                    <ListItem key={index}>
                                        <Typography lineHeight={0.3} sx={{ fontSize: '1.1em' }}>
                                            {firstName} {lastName}
                                        </Typography>
                                    </ListItem>
                                )}
                            </List>
                        }
                    </>
                }>
                <Typography fontSize='small' color='text.secondary' textAlign='right'>
                    {usersThatSaved.length} {usersThatSaved.length === 1 ? 'person' : 'people'} saved
                </Typography>
            </Tooltip>
        </Stack>
    )
}