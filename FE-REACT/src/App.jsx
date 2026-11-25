import { useState } from 'react'
import Login from './pages/Login.jsx'
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
  return (
    <Register onMasuk={() => setHalaman('login')} />
  )
}


  if (!sesi) {
    return <Login onSuccess={handleLogin} onDaftar={() => setHalaman('daftar')} />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-[392px] rounded-xl border border-base-300 bg-base-100 p-10 text-center">
        <h1 className="text-2xl font-bold">Halo, {sesi.name}</h1>
        <p className="mt-2 text-sm text-neutral">Login berhasil.</p>
        <button
          onClick={handleLogout}
          className="btn btn-outline mt-6 h-10 min-h-10 w-full rounded-md text-sm font-bold"
        >
          Keluar
        </button>
      </div>
    </main>
  )
}