import { Navigate, Route, Routes } from "react-router-dom";
import Box from '@mui/system/Box'
import MainSite from "../components/MainSite";
import Signin from "../components/Signin";
import SignUp from "../components/Signup";
import Settings from "../components/Settings";
import SingleVenuePage, { VenueTabPack } from "../components/SingleVenuePage";
import Account from "../components/Account";
import SingleEventPage, { EventTabPack } from "../components/SingleEventPage";
import CreateVenue from "../components/CreateVenue";
import UserProvider from "../context/UserContext";
import { ToastContainer } from "react-toastify";
import { useIsDarkMode } from "../theme/ThemeProvider";
import 'react-toastify/dist/ReactToastify.css';
import RestrictedPage from "../components/RestrictedPage";
import CreateEvent from "../components/CreateEvent";
import Browse, { BrowseTabPack } from "../components/Browse";
import SavedEvents from "../components/SavedEvents";
import SavedVenues from "../components/SavedVenues";
import Hosting from "../components/Hosting";
import EditEvent from "../components/EditEvent";
import EditVenue from "../components/EditVenue";
import PageNotFound from "../components/PageNotFound";

function App() {

  const { pageRoute: browseRoute, routePathsAndComponents: BrowseTabComponents } = BrowseTabPack
  const { pageRoute: venueRoute, routePathsAndComponents: VenueTabComponents } = VenueTabPack
  const { pageRoute: eventRoute, routePathsAndComponents: EventTabComponents } = EventTabPack

  const isDarkMode = useIsDarkMode()

  return (
    <UserProvider>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100dvh',
        bgcolor: 'background.default',
        color: 'text.primary',
        transition: 'background 0.2s'
      }}>

        <Routes>

          <Route path="/" element={<MainSite />}>

            <Route index element={<Navigate to='/browse/events' replace />} />
            <Route path={browseRoute} element={<Browse />} >
              <Route index element={<Navigate to='events' replace />} />
              {BrowseTabComponents.map(({ path, component }) => <Route path={path} element={component} key={path} />)}
            </Route>

            <Route path='savedevents/' element={<RestrictedPage><SavedEvents /></RestrictedPage>} />
            <Route path='savedvenues/' element={<RestrictedPage><SavedVenues /></RestrictedPage>} />
            <Route path='hosting/' element={<RestrictedPage><Hosting /></RestrictedPage>} />

            <Route path="account/" element={<RestrictedPage><Account /></RestrictedPage>} />
            <Route path="settings/" element={<RestrictedPage><Settings /></RestrictedPage>} />
            <Route path="events/" element={<Navigate to='/browse' replace />} />
            <Route path="events/create/" element={<RestrictedPage><CreateEvent /></RestrictedPage>} />
            <Route path="venues/" element={<Navigate to='/browse' replace />} />
            <Route path="venues/create/" element={<RestrictedPage><CreateVenue /></RestrictedPage>} />

            <Route path={venueRoute} element={<SingleVenuePage />}>
              <Route index element={<Navigate to={'events'} replace />} />
              {VenueTabComponents.map(({ path, component }) => <Route path={path} element={component} key={path} />)}
            </Route>
            <Route path="venues/:venueId/edit" element={<RestrictedPage><EditVenue /></RestrictedPage>} />

            <Route path={eventRoute} element={<SingleEventPage />}>
              <Route index element={<Navigate to={'discussion'} replace />} />
              {EventTabComponents.map(({ path, component }) => <Route path={path} element={component} key={path} />)}
            </Route>
            <Route path="events/:eventId/edit" element={<RestrictedPage><EditEvent /></RestrictedPage>} />

            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route path="/signin/" element={<Signin />} />
          <Route path="/signup/" element={<SignUp />} />

        </Routes>

      </Box>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        theme={isDarkMode ? 'dark' : 'light'}
        pauseOnFocusLoss={false}
        limit={3}
      />
    </UserProvider>
  )
}

export default App