
import { useState } from 'react'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EditProfil from './pages/EditProfil.jsx'
import Register from './pages/Register.jsx'

const KEY = 'sesi-laporan'

function bacaSesi() {
  try {
    return JSON.parse(localStorage.getItem(KEY))
  } catch {
    return null
  }
}

export default function App() {
  const [sesi, setSesi] = useState(bacaSesi)
  const [halaman, setHalaman] = useState('login')

  function handleLogin(data) {
    localStorage.setItem(KEY, JSON.stringify(data))
    setSesi(data)
  }

  function handleLogout() {
    localStorage.removeItem(KEY)
    setSesi(null)
    setHalaman('login')
  }

 if (!sesi && halaman === 'daftar') {
  return <Register onMasuk={() => setHalaman('login')} />
}

  if (!sesi) {
    return (
      <Login
        onSuccess={handleLogin}
        onDaftar={() => setHalaman('daftar')}
      />
    )
  }

  return <Dashboard sesi={sesi} onLogout={handleLogout} />
}
