import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Reports from './pages/Reports'

// ProtectedRoute wraps any page that requires login, if not logged in redirects to /login
function ProtectedRoute({ children }){
  const { token } = useAuth()
  return token ? children: <Navigate to="/login" replace />
}

function AppRoutes(){
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/expenses" element={
        <ProtectedRoute><Expenses /></ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute><Reports /></ProtectedRoute>
      } />
      {/* Redirect any unknown URL to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}