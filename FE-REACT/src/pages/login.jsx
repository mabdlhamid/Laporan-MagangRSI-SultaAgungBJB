
import { useState } from 'react'

const ikon = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function IkonDokumen() {
  return (
    <svg {...ikon} className="h-6 w-6">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  )
}

function IkonUser() {
  return (
    <svg {...ikon} className="h-5 w-5">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
    </svg>
  )
}

function IkonMata() {
  return (
    <svg {...ikon} className="h-5 w-5">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IkonMataCoret() {
  return (
    <svg {...ikon} className="h-5 w-5">
      <path d="M17.9 17.9A10.4 10.4 0 0 1 12 19C5.6 19 2 12 2 12a18 18 0 0 1 5.1-5.9M9.9 5.2A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a18 18 0 0 1-2.2 3.2" />
      <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2M2 2l20 20" />
    </svg>
  )
}

export default function Login({ onSuccess, onDaftar }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [lihat, setLihat] = useState(false)
  const [bantuan, setBantuan] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!username.trim() || !password) {
      setError('Username dan password wajib diisi.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Username atau password salah.')
        return
      }

      onSuccess(data)
    } catch {
      setError(
        'Tidak dapat terhubung ke server. Pastikan backend berjalan.'
      )
    } finally {
      setLoading(false)
    }
  }

  const kolom =
    'h-12 w-full rounded-xl border border-base-300 bg-base-100 pl-11 pr-4 text-sm outline-none transition duration-200 placeholder:text-neutral/70 focus:border-primary focus:ring-4 focus:ring-primary/10'

  return (
    <div className="login-page relative flex min-h-screen flex-col overflow-hidden bg-base-200">
      {/* Dekorasi latar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-32 h-[440px] w-[440px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />

        <div className="absolute left-[8%] top-[35%] h-14 w-14 rotate-12 rounded-2xl border-2 border-primary/20" />
        <div className="absolute right-[10%] top-[30%] h-12 w-12 rounded-full border-2 border-sky-400/30" />
        <div className="absolute right-[20%] bottom-[18%] h-4 w-4 rotate-45 bg-primary/20" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-center gap-3 px-4 pb-4 pt-8 sm:pt-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/20">
          <IkonDokumen />
        </span>

       
<div className="flex flex-col gap-1">
  <p className="text-2xl font-extrabold tracking-tight text-base-content">
    <span className="text-primary">Magang</span>Hub
  </p>

  <p className="text-sm font-semibold text-base-content">
    RSI Sultan Agung Banjarbaru
  </p>

  <div className="mt-1 flex flex-wrap items-center gap-2">
    <span className="rounded-md bg-primary/10 px-2 py-1 text-[11px] font-bold tracking-wide text-primary">
      BATCH 3A
    </span>

    <span className="text-xs text-neutral">
      Sistem Pelaporan Kegiatan Magang
    </span>
  </div>
</div>

      </header>

      {/* Form login */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:py-10">
        <section className="w-full max-w-md overflow-hidden rounded-3xl border border-white/80 bg-base-100/95 shadow-2xl shadow-slate-300/40 backdrop-blur-sm">
          <div className="px-6 pb-8 pt-8 sm:px-9 sm:pb-9 sm:pt-10">
            <div className="mb-8 text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <IkonDokumen />
              </span>

              <h1 className="text-3xl font-extrabold tracking-tight">
                Selamat Datang
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-neutral">
                Masuk ke akunmu untuk melanjutkan
                <br className="hidden sm:block" /> kegiatan laporan magang.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-semibold"
                >
                  Username
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral">
                    <IkonUser />
                  </span>

                  <input
                    id="username"
                    className={kolom}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      setError('')
                    }}
                    placeholder="Masukkan username"
                    autoComplete="username"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => setBantuan(!bantuan)}
                    aria-expanded={bantuan}
                    className="text-xs font-semibold text-primary transition hover:underline sm:text-sm"
                  >
                    Lupa password?
                  </button>
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral">
                    <svg {...ikon} className="h-5 w-5">
                      <rect x="3" y="10" width="18" height="11" rx="2" />
                      <path d="M7 10V7a5 5 0 0 1 10 0v3M12 14v3" />
                    </svg>
                  </span>

                  <input
                    id="password"
                    className={`${kolom} pr-12`}
                    type={lihat ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setLihat(!lihat)}
                    aria-label={
                      lihat
                        ? 'Sembunyikan password'
                        : 'Tampilkan password'
                    }
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral transition hover:text-primary"
                  >
                    {lihat ? <IkonMata /> : <IkonMataCoret />}
                  </button>
                </div>

                {bantuan && (
                  <div className="mt-3 rounded-xl border border-primary/10 bg-primary/5 p-3 text-sm leading-relaxed text-base-content">
                    <p className="font-semibold text-primary">
                      Butuh bantuan?
                    </p>
                    <p className="mt-1 text-neutral">
                      Hubungi pembimbing magang untuk membantu mengatur
                      ulang password akunmu.
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error"
                >
                  <span className="font-bold">!</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary mt-1 h-12 min-h-12 w-full rounded-xl border-0 text-sm font-bold shadow-lg shadow-primary/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/20 disabled:translate-y-0 disabled:opacity-60"
              >
                {loading && (
                  <span className="loading loading-spinner loading-sm" />
                )}
                {loading ? 'Memeriksa akun...' : 'Masuk ke Akun'}
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-base-300" />
              <span className="text-xs text-neutral">ATAU</span>
              <div className="h-px flex-1 bg-base-300" />
            </div>

            <p className="text-center text-sm text-neutral">
              Belum memiliki akun?{' '}
              <button
                type="button"
                onClick={onDaftar}
                className="font-bold text-primary transition hover:underline"
              >
                Daftar sekarang
              </button>
            </p>
          </div>

          <div className="border-t border-base-300 bg-base-200/70 px-5 py-4 text-center">
            <p className="text-xs leading-relaxed text-neutral sm:text-sm">
              Pastikan kamu menggunakan akun yang terdaftar.
            </p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 px-4 pb-6 pt-2 text-center">
        <p className="text-xs text-neutral sm:text-sm">
          © {new Date().getFullYear()} Laporan Magang
          <span className="mx-2">·</span>
          Dibuat untuk mendukung kegiatan magang
        </p>
      </footer>
    </div>
  )
}
