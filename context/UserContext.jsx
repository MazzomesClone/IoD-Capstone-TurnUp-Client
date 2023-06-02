import axios from 'axios'
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSetThemeMode, useSetThemeModeToDefault } from '../theme/ThemeProvider'

const UserContext = createContext(null)

async function verifyCookie() {
    try {
        const { data: userData } = await axios.get('/api/users/verify')
        return userData
    } catch (err) {
        console.log('Failed to sign in')
    }
    return null
}

export default function UserProvider({ children }) {

    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [initialised, setInitialised] = useState(false)

    const [savedVenues, setSavedVenues] = useState(null)
    const [savedEvents, setSavedEvents] = useState(null)

    const [signinLoading, setSigninLoading] = useState(false)
    const [signupLoading, setSignupLoading] = useState(false)

    const [signinMsg, setSigninMsg] = useState({ msg: '', color: 'inherit' })
    const [signupMsg, setSignupMsg] = useState({ msg: '', color: 'inherit' })

    const setThemeMode = useSetThemeMode()
    const setThemeModeToDefault = useSetThemeModeToDefault()

    async function initUser() {
        const userData = await verifyCookie()
        setUser(userData)

        if (userData?.themeMode) setThemeMode(userData.themeMode)
        else setThemeModeToDefault()

        setInitialised(true)
        return userData
    }

    useEffect(() => {
        initUser()
    }, [])

    async function getSavedEvents() {
        try {
            const { data: savedEvents } = await axios.get('/api/events/saved')
            setSavedEvents(savedEvents)
        } catch (err) {
            console.log(err.message)
        }
    }

    async function getSavedVenues() {
        try {
            const { data: savedVenues } = await axios.get('/api/venues/saved')
            setSavedVenues(savedVenues)
        } catch (err) {
            console.log(err.message)
        }
    }

    async function handleLogin(e) {
        try {
            e.preventDefault()
            setSigninLoading(true)

            const signinData = Object.fromEntries(new FormData(e.target))
            await axios.post('/api/users/login', signinData)

            const userData = await initUser()

            setSigninLoading(false)
            setSigninMsg({ msg: '', color: 'inherit' })
            toast(`👋 Welcome ${userData.firstName}!`, { theme: userData?.themeMode ? userData.themeMode : 'light' })
            navigate(-1)

        } catch (err) {
            console.log(err)
            if (err.response.status === 403) {
                setSigninLoading(false)
                setSigninMsg({ msg: 'Incorrect username or password', color: 'error.main' })
            }
        }
    }

    async function handleLogout() {
        try {
            await axios.delete('/api/users/logout')
            await initUser()
            setSavedEvents(null)
            setSavedVenues(null)
            setSigninMsg({ msg: 'You have been signed out', color: 'success.main' })
            navigate('/signin')
            toast.success('You have been signed out')
        } catch (err) {
            console.log(err.message)
        }
    }

    async function handleSignup(e) {
        try {
            e.preventDefault()
            setSignupLoading(true)

            const signupData = Object.fromEntries(new FormData(e.target))
            signupData.password2 = undefined
            await axios.post('/api/users/new', signupData)

            setSignupLoading(false)
            setSignupMsg({ msg: '', color: 'inherit' })
            setSigninMsg({ msg: 'Account created! Please sign in', color: 'success.main' })
            navigate('/signin', { replace: true })

        } catch (err) {
            if (err.response.status === 409) {
                setSignupLoading(false)
                setSignupMsg({ msg: 'An account with this email already exists', color: 'error.main' })
            }
            console.log(err.message)
        }
    }

    return (
        <UserContext.Provider value={{
            handleLogin,
            handleLogout,
            handleSignup,
            signinLoading,
            signupLoading,
            user,
            initialised,
            signinMsg,
            setSigninMsg,
            signupMsg,
            setSignupMsg,
            savedVenues,
            savedEvents,
            getSavedEvents,
            getSavedVenues,
            initUser
        }}>
            {children}
        </UserContext.Provider>
    )
}

export function useIsSiteInitialised() {
    const { initialised } = useContext(UserContext)
    return initialised
}

export function useInitUser() {
    const { initUser } = useContext(UserContext)
    return initUser
}

export function useLoginPage() {
    const { handleLogin, signinMsg, setSigninMsg, signinLoading } = useContext(UserContext)
    const resetSigninMsg = () => setSigninMsg({ msg: '', color: 'inherit' })
    return { handleLogin, signinMsg, resetSigninMsg, signinLoading }
}

export function useHandleLogout() {
    const { handleLogout } = useContext(UserContext)
    return handleLogout
}

export function useSignupPage() {
    const { handleSignup, signupMsg, setSignupMsg, signupLoading } = useContext(UserContext)
    const resetSignupMsg = () => setSignupMsg({ msg: '', color: 'inherit' })
    return { handleSignup, signupMsg, resetSignupMsg, signupLoading }
}

export function useCurrentUser() {
    const { user } = useContext(UserContext)
    return user
}

export function useSavedVenues(venueId = '') {
    const { savedVenues, getSavedVenues, user } = useContext(UserContext)

    if (!savedVenues && user) getSavedVenues()

    async function saveVenue() {
        try {
            await axios.post(`/api/venues/save/${venueId}`)
            getSavedVenues()
        } catch (err) {
            console.log(err.message)
        }
    }

    async function unsaveVenue() {
        try {
            await axios.delete(`/api/venues/unsave/${venueId}`)
            getSavedVenues()
        } catch (err) {
            console.log(err.message)
        }
    }

    const isVenueSaved = savedVenues?.find(({ _id }) => venueId === _id)

    return { savedVenues, saveVenue, unsaveVenue, isVenueSaved, getSavedVenues }
}

export function useSavedEvents(eventId = '') {
    const { savedEvents, getSavedEvents, user } = useContext(UserContext)

    if (!savedEvents && user) getSavedEvents()

    async function saveEvent() {
        try {
            await axios.post(`/api/events/save/${eventId}`)
            getSavedEvents()
        } catch (err) {
            console.log(err.message)
        }
    }

    async function unsaveEvent() {
        try {
            await axios.delete(`/api/events/unsave/${eventId}`)
            getSavedEvents()
        } catch (err) {
            console.log(err.message)
        }
    }

    const isEventSaved = savedEvents?.find(({ _id }) => eventId === _id)

    return { savedEvents, saveEvent, unsaveEvent, isEventSaved, getSavedEvents }
}