import { Routes, Route, Navigate } from 'react-router-dom'
import routes from './routes.jsx'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

// Separate component for routes so useAuth can be used inside AuthProvider
function AppRoutes() {
  return (
    <Routes>
      {routes.map((route) => {
        // For protected routes, wrap with ProtectedRoute
        if (route.protected) {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute>
                  {route.element}
                </ProtectedRoute>
              }
            />
          )
        }
        
        // Regular routes
        return (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        )
      })}
    </Routes>
  )
}

export default App
