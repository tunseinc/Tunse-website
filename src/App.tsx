import { Navigate, Route, Routes } from "react-router"
import Privacy from "./pages/privacy"
import TermsAndConditions from "./pages/terms-and-conditions"
import DeleteAccount from "./pages/delete-account"
import Homepage from "./pages/homepage"
import Home from "./pages/home"
import AboutUs from "./pages/about-us"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/delete-tunse-account" element={<DeleteAccount />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </>
  )
}

export default App
