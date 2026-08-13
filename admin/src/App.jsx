import { Navigate, Route, Routes } from 'react-router-dom'
import { useContext } from 'react'

import Dashboard from './pages/Dashboard'
import Admins from './pages/Admins'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Companies from './pages/Companies'
import Jobs from './pages/Jobs'
import Applicants from './pages/Applicants'
import Reports from './pages/Reports'
import Hired from './pages/Hired'
import Rejected from './pages/Rejected'
import CompaniesArchive from './pages/CompaniesArchive'
import JobsArchive from './pages/JobsArchive'
import NotFound from './components/NotFound'
import Loading from './components/Loading'

import { UserContext } from './context/AuthProvider'
import SystemContent from './pages/SystemContent'

function App() {

  const { loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className='h-screen flex-center'>
        <Loading />
      </div>
    );
  }

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Login />} />

      {/* PROTECTED ROUTES */}
      <Route path='/app/dashboard' element={
        <ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path='/app/companies' element={
        <ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}>
          <Companies />
        </ProtectedRoute>
      } />

      <Route path='/app/companies/archive' element={
        <ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}>
          <CompaniesArchive />
        </ProtectedRoute>
      } />

      <Route path='/app/jobs' element={
        <ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}>
          <Jobs />
        </ProtectedRoute>
      } />

      <Route path='/app/jobs/archive' element={
        <ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}>
          <JobsArchive />
        </ProtectedRoute>
      } />

      <Route path='/app/applicants' element={
        <ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}>
          <Applicants />
        </ProtectedRoute>
      } />

      <Route path='/app/hired' element={
        <ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}>
          <Hired />
        </ProtectedRoute>
      } />

      <Route path='/app/rejected' element={
        <ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}>
          <Rejected />
        </ProtectedRoute>
      } />

      <Route path='/app/reports' element={
        <ProtectedRoute allowedRoles={['HR Associate', 'HR Manager']}>
          <Reports />
        </ProtectedRoute>
      } />

      {/* HR MANAGER ONLY */}
      <Route path='/app/admins' element={
        <ProtectedRoute allowedRoles={['HR Manager']}>
          <Admins />
        </ProtectedRoute>
      } />

      <Route path='/app/systemContent' element={
        <ProtectedRoute allowedRoles={['HR Manager']}>
          <SystemContent />
        </ProtectedRoute>
      } />

      {/* NOT FOUND */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App;