import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Admins from './pages/Admins'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Companies from './pages/Companies'
import Jobs from './pages/Jobs'
import Interviews from './pages/Interviews'
import Applicants from './pages/Applicants'
import Reports from './pages/Reports'
import Orientations from './pages/Orientations'
import Hired from './pages/Hired'
import RejectedBlacklisted from './pages/RejectedBlacklisted'

function App() {

  return (
    <Routes>
      {/* <Route path='/' element={<Navigate to={'/app/dashboard'} replace />} /> */}
      <Route path='/' element={<Login />} />
      <Route path='/app/dashboard' element={<ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}><Dashboard /></ProtectedRoute>} />
      <Route path='/app/companies' element={<ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}><Companies /></ProtectedRoute>} />
      <Route path='/app/jobs' element={<ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}><Jobs /></ProtectedRoute>} />
      <Route path='/app/applicants' element={<ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}><Applicants /></ProtectedRoute>} />
      <Route path='/app/interviews' element={<ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}><Interviews /></ProtectedRoute>} />
      <Route path='/app/orientations' element={<ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}><Orientations /></ProtectedRoute>} />
      <Route path='/app/hired' element={<ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}><Hired /></ProtectedRoute>} />
      <Route path='/app/rejected' element={<ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}><RejectedBlacklisted /></ProtectedRoute>} />
      <Route path='/app/admins' element={<ProtectedRoute allowedRoles={['HR Manager']}><Admins /></ProtectedRoute>} />
      <Route path='/app/reports' element={<ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}><Reports /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  )
}

export default App
