
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

function IkonMata({ coret = false }) {
  return (
    <svg {...ikon} className="h-5 w-5">
      {coret ? (
        <>
          <path d="M17.9 17.9A10.4 10.4 0 0 1 12 19C5.6 19 2 12 2 12a18 18 0 0 1 5.1-5.9M9.9 5.2A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a18 18 0 0 1-2.2 3.2" />
          <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2M2 2l20 20" />
        </>
      ) : (
        <>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
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

export default function Register({ onMasuk }) {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [konfirmasi, setKonfirmasi] = useState('')
  const [lihat, setLihat] = useState(false)
  const [lihatKonfirmasi, setLihatKonfirmasi] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [berhasil, setBerhasil] = useState(false)

  const kolom =
    'h-12 w-full rounded-xl border border-base-300 bg-base-100 pl-11 pr-4 text-sm outline-none transition duration-200 placeholder:text-neutral/70 focus:border-primary focus:ring-4 focus:ring-primary/10'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !username.trim() || !password) {
      setError('Nama lengkap, username, dan password wajib diisi.')
      return
    }

    if (password.length < 6) {
      setError('Password minimal terdiri dari 6 karakter.')
      return
    }

    if (password !== konfirmasi) {
      setError('Konfirmasi password tidak cocok.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim(),
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Pendaftaran gagal. Silakan coba lagi.')
        return
      }

      setBerhasil(true)
    } catch {
      setError(
        'Tidak dapat terhubung ke server. Pastikan backend berjalan.'
      )
    } finally {
      setLoading(false)
    }
  }

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
      </div>

      {/* Identitas aplikasi */}
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-primary/10 px-2 py-1 text-[11px] font-bold tracking-wide text-primary">
              BATCH 3A
            </span>
            <span className="text-xs text-neutral">
              Sistem Pelaporan Kegiatan Magang
            </span>
          </div>
        </div>
      </header>

      {/* Form pendaftaran */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <section className="w-full max-w-md overflow-hidden rounded-3xl border border-white/80 bg-base-100/95 shadow-2xl shadow-slate-300/40 backdrop-blur-sm">
          <div className="px-6 pb-8 pt-8 sm:px-9">
            {berhasil ? (
              <div className="py-5 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                  <svg {...ikon} className="h-8 w-8">
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                </div>

                <h1 className="text-2xl font-extrabold">
                  Pendaftaran Berhasil!
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-neutral">
                  Akun MagangHub kamu berhasil dibuat. Silakan masuk
                  menggunakan username dan password yang sudah didaftarkan.
                </p>

                <button
                  type="button"
                  onClick={onMasuk}
                  className="btn btn-primary mt-7 h-12 min-h-12 w-full rounded-xl border-0 font-bold shadow-lg shadow-primary/20"
                >
                  Masuk Sekarang
                </button>
              </div>
            ) : (
              <>
                <div className="mb-7 text-center">
                  <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <IkonUser />
                  </span>

                  <h1 className="text-2xl font-extrabold tracking-tight">
                    Buat Akun
                  </h1>

                  <p className="mt-2 text-sm text-neutral">
                    Daftarkan dirimu untuk memulai kegiatan magang.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label
                      htmlFor="register-name"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Nama Lengkap
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral">
                        <IkonUser />
                      </span>
                      <input
                        id="register-name"
                        className={kolom}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        autoComplete="name"
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-username"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Username
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral">
                        <svg {...ikon} className="h-5 w-5">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                        </svg>
                      </span>
                      <input
                        id="register-username"
                        className={kolom}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Buat username"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-password"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral">
                        <svg {...ikon} className="h-5 w-5">
                          <rect x="3" y="10" width="18" height="11" rx="2" />
                          <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                        </svg>
                      </span>

                      <input
                        id="register-password"
                        className={`${kolom} pr-12`}
                        type={lihat ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        autoComplete="new-password"
                        minLength={6}
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setLihat(!lihat)}
                        aria-label={
                          lihat ? 'Sembunyikan password' : 'Tampilkan password'
                        }
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral hover:text-primary"
                      >
                        <IkonMata coret={!lihat} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-confirm"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Konfirmasi Password
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral">
                        <svg {...ikon} className="h-5 w-5">
                          <rect x="3" y="10" width="18" height="11" rx="2" />
                          <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                        </svg>
                      </span>

                      <input
                        id="register-confirm"
                        className={`${kolom} pr-12`}
                        type={lihatKonfirmasi ? 'text' : 'password'}
                        value={konfirmasi}
                        onChange={(e) => setKonfirmasi(e.target.value)}
                        placeholder="Ulangi password"
                        autoComplete="new-password"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setLihatKonfirmasi(!lihatKonfirmasi)}
                        aria-label={
                          lihatKonfirmasi
                            ? 'Sembunyikan konfirmasi password'
                            : 'Tampilkan konfirmasi password'
                        }
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral hover:text-primary"
                      >
                        <IkonMata coret={!lihatKonfirmasi} />
                      </button>
                    </div>
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
                    className="btn btn-primary mt-1 h-12 min-h-12 w-full rounded-xl border-0 text-sm font-bold shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
                  >
                    {loading && (
                      <span className="loading loading-spinner loading-sm" />
                    )}
                    {loading ? 'Membuat akun...' : 'Buat Akun'}
                  </button>
                </form>

                <p className="mt-7 text-center text-sm text-neutral">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={onMasuk}
                    className="font-bold text-primary hover:underline"
                  >
                    Masuk sekarang
                  </button>
                </p>
              </>
            )}
          </div>

          <div className="border-t border-base-300 bg-base-200/70 px-5 py-4 text-center">
            <p className="text-xs leading-relaxed text-neutral sm:text-sm">
              MagangHub · RSI Sultan Agung Banjarbaru · Batch 3A
            </p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 px-4 pb-6 pt-2 text-center">
        <p className="text-xs text-neutral sm:text-sm">
          © {new Date().getFullYear()} MagangHub
        </p>
      </footer>
    </div>
  )
}
