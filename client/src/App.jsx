import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import JobPosting from "./pages/JobPosting"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import { useContext } from "react"
import { UserContext } from "./context/AuthProvider"
import NotFound from "./components/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Loading from "./components/Loading"

function App() {
  const { loading } = useContext(UserContext);

  // ✅ Prevent redirect before auth is ready
  if (loading) {
    return (
      <div className='h-screen flex-center'>
        <Loading />
      </div>
    );
  }

  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/jobposting" element={<JobPosting />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* PROTECTED */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
