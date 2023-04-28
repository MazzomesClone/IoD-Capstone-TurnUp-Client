import Button from '@mui/material/Button';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { useState, useContext, useMemo, createContext } from 'react';

export const ColorModeContext = createContext({ toggleColorMode: () => { } });

const fontFamily = "'Heebo', sans-serif"

const lightConfig = {
    palette: {
        mode: 'light',
        primary: {
            main: '#412673'
        },
        background: {
            default: '#f7f7f7'
        }
    },
    typography: {
        fontFamily: fontFamily
    }
}

const darkConfig = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#b69fdf'
        },
        background: {
            paper: '#1e1e1e'
        }
    },
    typography: {
        fontFamily: fontFamily
    }
}

export function ToggleThemeButton() {
    const theme = useTheme();
    const { colorMode } = useContext(ColorModeContext);
    const mode = theme.palette.mode
    return (
        <Button sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} >
            {mode === 'dark' ? 'Light' : 'Dark'} mode&nbsp;&nbsp;{mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </Button>
    );
}

export function useIsDarkMode() {
    const { mode } = useContext(ColorModeContext);
    return mode === 'dark'
}

export default function ThemeWrapper({ children }) {
    const [mode, setMode] = useState('light');
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = useMemo(
        () =>
            createTheme(mode === 'light' ? lightConfig : darkConfig),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={{ colorMode, mode }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
