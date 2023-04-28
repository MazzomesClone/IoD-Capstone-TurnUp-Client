import { Navigate } from "react-router-dom"
import { useCurrentUser } from "../context/UserContext"

export default function ProtectedPage({ children }) {

    const user = useCurrentUser()

    if (user) return (
        <>
            {children}
        </>
    )

    return (
        <Navigate to={'/signin'} replace />
    )
}
