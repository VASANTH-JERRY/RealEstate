import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar.jsx"
import SignUp from "./pages/SignUp.jsx"
import SignIn from "./pages/SignIn.jsx"
import Profile from "./pages/Profile.jsx"
import PrivateRoute from "./components/PrivateRoute.jsx"
import CreateListing from "./pages/CreateListing.jsx"
import {Toaster} from "react-hot-toast"
import UpdateListing from "./pages/UpdateListing.jsx"
import Listing from "./pages/Listing.jsx"
import Search from "./pages/Search.jsx"
import Home from "./pages/Home.jsx"
import About from "./pages/About.jsx"
function App() {

  return (
    <>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route element={<PrivateRoute />} >
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:lid" element={<UpdateListing />} />
        </Route>
        <Route path="/listing/:lid" element={<Listing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        
      </Routes>
    </BrowserRouter>
    <Toaster />
    </>
  )
}

export default App
