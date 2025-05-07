import { Navigate, Route, Routes } from "react-router"
import Home from "./pages/home"
import Privacy from "./pages/privacy"
import TermsAndConditions from "./pages/terms-and-conditions"
import DeleteAccount from "./pages/delete-account"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/delete-tunse-account" element={<DeleteAccount />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </>
  )
}

export default App
