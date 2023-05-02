import { styled } from "@mui/material"

const LiveIndicator = styled('div')(({ theme }) => ({
    margin: '0px 0.5em',
    width: '5px',
    height: '5px',
    backgroundColor: `${theme.palette.success.main}`,
    borderRadius: '50%',
    animation: 'ripple 1.5s infinite linear',
    border: `1px solid ${theme.palette.success.main}`,
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 0,
        },
        '30%': {
            transform: 'scale(1.28)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    }
}))

export default LiveIndicator