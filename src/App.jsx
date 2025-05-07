import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { AuthProvider } from './context/AuthContext'
import './App.css'

function App() {
  // Demo state để chuyển đổi giữa các trang (sẽ thay bằng router sau)
  const [page, setPage] = useState('login') // 'login' hoặc 'dashboard'

  // Function demo để chuyển trang
  const navigateTo = (targetPage) => {
    setPage(targetPage)
  }

  return (
    <AuthProvider>
      {page === 'login' ? (
        <Login onLoginSuccess={() => navigateTo('dashboard')} />
      ) : (
        <Dashboard onLogout={() => navigateTo('login')} />
      )}
    </AuthProvider>
  )
}

export default App
