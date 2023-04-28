import { useTheme } from "@emotion/react"
import { useMediaQuery } from "@mui/material"

export function useIsMobile() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.up('sm'))
    return isMobile
}