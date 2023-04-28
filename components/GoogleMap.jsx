import { useIsDarkMode } from "../theme/ThemeProvider"

export default function GoogleMap({ placeId, sx = {} }) {

    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

    const qQuery = placeId ? `place_id:${placeId}` : null

    const isDarkMode = useIsDarkMode()

    return (
        <>
            <iframe
                style={{ border: 0, width: '100%', height: '300px', filter: isDarkMode && 'invert(90%)', ...sx }}
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${qQuery}`}
                allowFullScreen>
            </iframe>
        </>
    )
}
