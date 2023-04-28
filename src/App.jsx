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

function App() {

  const { pageRoute: venueRoute, routePathsAndComponents: VenueTabComponents } = VenueTabPack
  const { pageRoute: eventRoute, routePathsAndComponents: EventTabComponents } = EventTabPack

  const isDarkMode = useIsDarkMode()

  return (
    <UserProvider>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        transition: 'background 0.2s'
      }}>

        <Routes>

          <Route path="/" element={<MainSite />}>

            <Route path="account/" element={<Account />} />
            <Route path="settings/" element={<Settings />} />
            <Route path="events/" element={<>All events</>} />
            <Route path="venues/" element={<>All venues</>} />
            <Route path="venues/create/" element={<CreateVenue />} />

            <Route path={venueRoute} element={<SingleVenuePage />}>
              <Route index element={<Navigate to={'events'} replace />} />
              {VenueTabComponents.map(({ path, component }) => <Route path={path} element={component} key={path} />)}
            </Route>

            <Route path={eventRoute} element={<SingleEventPage />}>
              <Route index element={<Navigate to={'discussion'} replace />} />
              {EventTabComponents.map(({ path, component }) => <Route path={path} element={component} key={path} />)}
            </Route>

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
      />
    </UserProvider>
  )
}

export default App