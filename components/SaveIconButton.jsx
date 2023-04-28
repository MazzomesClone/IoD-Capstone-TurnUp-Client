import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import Box from "@mui/material/Box";
import { useCurrentUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function SaveIconButton({ isSaved, handleSave, handleUnsave, thingToSave = '', sx }) {

    const user = useCurrentUser()
    const navigate = useNavigate()

    return (
        <Box sx={sx}>
            <Tooltip title={user ? isSaved ? `Unsave ${thingToSave}` : `Save ${thingToSave}` : 'Sign in to save'} placement='right'>
                <IconButton sx={{ color: 'primary.main' }} onClick={user ? isSaved ? handleUnsave : handleSave : () => navigate('/signin')}>
                    {isSaved ? <BookmarkAddedIcon /> : <TurnedInNotIcon />}
                </IconButton>
            </Tooltip>
        </Box>
    )
}
