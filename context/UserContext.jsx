import axios from 'axios'
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

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
    const [savedVenues, setSavedVenues] = useState(null)
    const [savedEvents, setSavedEvents] = useState(null)
    const [signinMsg, setSigninMsg] = useState({ msg: '', color: 'inherit' })
    const [signupMsg, setSignupMsg] = useState({ msg: '', color: 'inherit' })

    async function initUser() {
        const userData = await verifyCookie()
        setUser(userData)
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

            const signinData = Object.fromEntries(new FormData(e.target))
            await axios.post('/api/users/login', signinData)

            const user = await verifyCookie()
            setUser(user)
            setSigninMsg({ msg: '', color: 'inherit' })
            toast(`👋 Welcome ${user.firstName}!`)
            navigate(-1)

        } catch (err) {
            if (err.response.status === 403) {
                setSigninMsg({ msg: 'Incorrect username or password', color: 'error.main' })
            }
            console.log(err)
        }
    }

    async function handleLogout() {
        try {
            delete axios.defaults.headers.common.Authorization
            await axios.delete('/api/users/logout')
            await initUser()
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
            const signupData = Object.fromEntries(new FormData(e.target))
            signupData.password2 = undefined
            await axios.post('/api/users/new', signupData)
            setSigninMsg({ msg: 'Account created! Please sign in', color: 'success.main' })
            navigate('/signin')

        } catch (err) {
            if (err.response.status === 409) {
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
            user,
            signinMsg,
            signupMsg,
            savedVenues,
            savedEvents,
            getSavedEvents,
            getSavedVenues
        }}>
            {children}
        </UserContext.Provider>
    )
}

export function useLoginPage() {
    const { handleLogin, signinMsg } = useContext(UserContext)
    return { handleLogin, signinMsg }
}

export function useHandleLogout() {
    const { handleLogout } = useContext(UserContext)
    return handleLogout
}

export function useSignupPage() {
    const { handleSignup, signupMsg } = useContext(UserContext)
    return { handleSignup, signupMsg }
}

export function useCurrentUser() {
    const { user } = useContext(UserContext)
    return user
}

export function useSavedVenues(venueId = '') {
    const { savedVenues, getSavedVenues } = useContext(UserContext)

    if (!savedVenues) getSavedVenues()

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

    return { savedVenues, saveVenue, unsaveVenue, isVenueSaved }
}

export function useSavedEvents(eventId = '') {
    const { savedEvents, getSavedEvents } = useContext(UserContext)

    if (!savedEvents) getSavedEvents()

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

    return { savedEvents, saveEvent, unsaveEvent, isEventSaved }
}