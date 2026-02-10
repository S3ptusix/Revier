import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import JobPosting from "./pages/Jobposting"
import Register from "./pages/Register"
import Login from "./pages/Login"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/jobposting" element={<JobPosting />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default App
