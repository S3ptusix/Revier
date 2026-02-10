import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import Admins from './pages/Admins'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Companies from './pages/Companies'
import Jobs from './pages/Jobs'
function App() {

  return (
    <Routes>
      {/* <Route path='/' element={<Navigate to={'/app/dashboard'} replace />} /> */}
      <Route path='/' element={<Login />} />
      <Route path='/app/dashboard' element={<ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}><Dashboard /></ProtectedRoute>} />
      <Route path='/app/companies' element={<ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}><Companies /></ProtectedRoute>} />
      <Route path='/app/jobs' element={<ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}><Jobs /></ProtectedRoute>} />
      <Route path='/app/admins' element={<ProtectedRoute allowedRoles={['HR Manager']}><Admins /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  )
}

export default App
