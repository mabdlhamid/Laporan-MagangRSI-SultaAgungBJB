import { useState, useEffect } from 'react'
import EditProfil from './EditProfil'
import Halaman from '../components/Halaman.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { ambilProfil, simpanProfil } from '../lib/profil.js'
import { ambilLaporan, buatLaporan } from '../lib/laporan.js'
import Perkembangan from './Perkembangan.jsx'
import KalenderKehadiran from '../components/KalenderKehadiran.jsx'

// tanggal hari ini (zona WITA) format YYYY-MM-DD
const hariIni = () =>
  new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Makassar' })

// "2026-11-25T00:00:00.000Z" → "25 Nov 2026"
function formatTanggal(iso) {
  return new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const kapital = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function Ikon({ nama, ukuran = 20 }) {
  const gambar = {
    clipboard: (
      <>
        <rect x="5" y="5" width="14" height="17" rx="2" />
        <path d="M9 5V3h6v2M8 11h8M8 15h8" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 4 4" />
      </>
    ),
  }

  return (
    <svg
      width={ukuran}
      height={ukuran}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden="true"
    >
      {gambar[nama]}
    </svg>
  )
}

const kartu =
  'rounded-3xl border border-white/80 bg-base-100/95 p-6 shadow-2xl shadow-slate-300/40 backdrop-blur-sm'

const kelasInput =
  'h-12 w-full rounded-xl border border-base-300 bg-base-100 px-4 text-sm outline-none transition duration-200 placeholder:text-neutral/70 focus:border-primary focus:ring-4 focus:ring-primary/10'

const kelasTextarea =
  'w-full resize-y rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-sm outline-none transition duration-200 placeholder:text-neutral/70 focus:border-primary focus:ring-4 focus:ring-primary/10'

function Pesan({ children }) {
  return <p className="py-6 text-center text-sm text-neutral">{children}</p>
}

function DaftarLaporan({ data, kosong }) {
  if (data.length === 0) return <Pesan>{kosong}</Pesan>

  return (
    <ul className="divide-y divide-base-300">
      {data.map((item) => (
        <li key={item.id} className="py-4 first:pt-0 last:pb-0">
          <p className="text-xs font-semibold text-primary">{formatTanggal(item.date)}</p>
          <p className="mt-2 text-xs text-neutral">Masalah</p>
          <p className="text-sm font-semibold leading-6">{item.problem}</p>
          <p className="mt-2 text-xs text-neutral">Penyelesaian</p>
          <p className="text-sm leading-6">{item.solving}</p>
          {item.kendala && (
            <p className="mt-2 text-xs leading-5 text-neutral">Kendala: {item.kendala}</p>
          )}
          {item.saran && (
            <p className="mt-1 text-xs leading-5 text-neutral">Saran: {item.saran}</p>
          )}
        </li>
      ))}
    </ul>
  )
}

export default function Dashboard({ sesi, onLogout }) {
  const [menuAktif, setMenuAktif] = useState('dashboard') // 'dashboard' | 'laporan' | 'profil'

  // ---------- Profil ----------
  const [profil, setProfil] = useState({
    nama: sesi?.name || '',
    email: '',
    telepon: '',
    institusi: '',
    jurusan: '',
    divisi: '',
    bio: '',
  })
  const [profilSiap, setProfilSiap] = useState(false)

  useEffect(() => {
    ambilProfil(sesi.token)
      .then(setProfil)
      .catch((err) => {
        if (err.status === 401) onLogout() // token kedaluwarsa
      })
      .finally(() => setProfilSiap(true))
  }, [sesi.token])

  async function handleSimpanProfil(dataBaru) {
    const tersimpan = await simpanProfil(sesi.token, dataBaru)
    setProfil(tersimpan)
  }

  // ---------- Laporan ----------
  const [laporan, setLaporan] = useState([])
  const [total, setTotal] = useState(0)
  const [memuat, setMemuat] = useState(true)
  const [errorMuat, setErrorMuat] = useState('')
  
const [attendanceStatus, setAttendanceStatus] = useState('HADIR')
const [mengambilGPS, setMengambilGPS] = useState(false)
const [latitude, setLatitude] = useState(null)
const [longitude, setLongitude] = useState(null)

  const [tanggal, setTanggal] = useState(hariIni)
  const [problem, setProblem] = useState('')
  const [solving, setSolving] = useState('')
  const [kendala, setKendala] = useState('')
  const [saran, setSaran] = useState('')
  const [menyimpan, setMenyimpan] = useState(false)
  const [pesanError, setPesanError] = useState('')
  const [pesanBerhasil, setPesanBerhasil] = useState('')
  const [pencarian, setPencarian] = useState('')

  useEffect(() => {
    ambilLaporan(sesi.token)
      .then((res) => {
        setLaporan(res.data)
        setTotal(res.meta.total)
      })
      .catch((err) => {
        if (err.status === 401) onLogout()
        else setErrorMuat(kapital(err.message))
      })
      .finally(() => setMemuat(false))
  }, [sesi.token])

  async function handleSimpanLaporan(e) {
    e.preventDefault()
    setPesanBerhasil('')

          if (!tanggal || !problem.trim() || !solving.trim() || !kendala.trim()) {
        setPesanError('Tanggal, aktivitas, pembelajaran, dan kendala wajib diisi.')
        return
      }

      if (
        problem.trim().length < 100 ||
        solving.trim().length < 100 ||
        kendala.trim().length < 100
      ) {
        setPesanError('Aktivitas, pembelajaran, dan kendala minimal 100 karakter.')
        return
      }

    setPesanError('')
    setMenyimpan(true)
    try {
      const baru = await buatLaporan(sesi.token, {
        date: tanggal,
        problem: problem.trim(),
        solving: solving.trim(),
        kendala: kendala.trim() || undefined,
        saran: saran.trim() || undefined,
         attendanceStatus,
        ...(latitude !== null && longitude !== null
          ? { latitude, longitude }
          : {}),
      })

      setLaporan((prev) => [baru, ...prev].sort((a, b) => b.date.localeCompare(a.date)))
      setTotal((t) => t + 1)
      setProblem('')
      setSolving('')
      setKendala('')
      setSaran('')
      setPesanBerhasil('Laporan berhasil disimpan.')
      setAttendanceStatus('HADIR')
      setLatitude(null)
      setLongitude(null)
    } catch (err) {
      if (err.status === 401) onLogout()
      else setPesanError(kapital(err.message))
    } finally {
      setMenyimpan(false)
    }
  }

  function pindah(id) {
    setMenuAktif(id)
    setPesanError('')
    setPesanBerhasil('')
  }

  // ---------- Turunan data ----------
  const nama = profil.nama || 'Peserta Magang'
  const sekarang = hariIni()
  const bulanIni = laporan.filter((l) => l.date.slice(0, 7) === sekarang.slice(0, 7)).length
  const sudahHariIni = laporan.some((l) => l.date.slice(0, 10) === sekarang)

  const laporanTampil = laporan.filter((item) => {
    const kata = pencarian.toLowerCase()
    return (
      item.problem.toLowerCase().includes(kata) ||
      item.solving.toLowerCase().includes(kata) ||
      formatTanggal(item.date).toLowerCase().includes(kata)
    )
  })

  const tombolKeluar = (
    <button
      type="button"
      onClick={onLogout}
      aria-label="Keluar"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-base-300 bg-base-100 text-neutral transition hover:border-error/30 hover:text-error"
    >
      <Ikon nama="logout" />
    </button>
  )

  const statistik = [
    { label: 'Total', nilai: total, ikon: 'clipboard', warna: 'text-primary bg-primary/10' },
    { label: 'Bulan ini', nilai: bulanIni, ikon: 'calendar', warna: 'text-sky-700 bg-sky-50' },
    sudahHariIni
      ? { label: 'Hari ini', nilai: 'Sudah', ikon: 'check', warna: 'text-emerald-700 bg-emerald-50' }
      : { label: 'Hari ini', nilai: 'Belum', ikon: 'clock', warna: 'text-amber-600 bg-amber-50' },
  ]

  const isiKosong = memuat ? 'Memuat laporan…' : errorMuat || 'Belum ada laporan.'

  return (
    <>
      {menuAktif === 'profil' && !profilSiap && (
        <Halaman judul="Edit Profil">
          <p className="text-sm text-neutral">Memuat profil…</p>
        </Halaman>
      )}

      {menuAktif === 'profil' && profilSiap && (
        <EditProfil
          profil={profil}
          onSimpan={handleSimpanProfil}
          onBatal={() => pindah('dashboard')}
        />
      )}

      
{menuAktif === 'dashboard' && (
  <Halaman
    judul={`Halo, ${nama} 👋`}
    deskripsi="Selamat datang kembali. siap belajar hari ini?"
    aksi={
      <button
        type="button"
        onClick={() => pindah('profil')}
        aria-label="Buka profil"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-md"
      >
        {nama.charAt(0).toUpperCase()}
      </button>
    }
    kartu={false}
  >


{/* Identitas MagangHub RSI */}

{/* Header ringkas MagangHub */}
<section className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
  <img
    src="/logo-rsi.jpg"
    alt="Logo RSI Sultan Agung"
    className="h-12 w-12 shrink-0 rounded-xl object-contain"
  />

  <div className="min-w-0 flex-1">
    <p className="text-xs font-bold tracking-wide text-emerald-700">
      RSI SULTAN AGUNG BANJARBARU
    </p>
    <h2 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">
      MagangHub
    </h2>
    <p className="text-xs text-slate-500">
      Portal peserta magang
    </p>
  </div>
</section>

    
    {/* Pengumuman */}
    <section className="mb-5 rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-white to-orange-50 p-5 shadow-sm">
      <div className="flex items-start gap-3">
     
      <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-lg font-extrabold text-amber-700">
        !
      </span>
        <div className="min-w-0">
          <h2 className="font-bold text-orange-950">
            Pengumuman magang
          </h2>
          <p className="mt-1 text-sm leading-6 text-orange-900/80">
            Informasi dan pengumuman dari admin akan ditampilkan di sini.
          </p>
        </div>
      </div>
    </section>

    {/* Status kehadiran hari ini */}
  <section className="overflow-hidden rounded-3xl border border-teal-100 bg-base-100 p-5 shadow-xl shadow-teal-950/5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Ikon nama="calendar" ukuran={23} />
          </span>

          <div>
            <h2 className="text-lg font-bold">Hari Ini</h2>
            <p className="mt-1 text-sm font-semibold">
              {new Date(`${sekarang}T12:00:00`).toLocaleDateString(
                'id-ID',
                {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }
              )}
            </p>
            <p className="mt-1 text-xs leading-5 text-neutral">
              Periode magang 16–15
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
          Aktif
        </span>
      </div>

     
<div
  className={`mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full ${
    sudahHariIni
      ? 'bg-emerald-50 text-emerald-600'
      : 'bg-teal-50 text-teal-700'
  }`}
>
  {sudahHariIni ? (
    <Ikon nama="check" ukuran={38} />
  ) : (
    <Ikon nama="clipboard" ukuran={38} />
  )}
</div>


      <div className="mt-5 text-center">
        
      <h3 className="text-lg font-bold text-slate-900">
        {sudahHariIni
          ? 'Laporan hari ini sudah diisi'
          : 'Belum ada laporan hari ini'}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {sudahHariIni
          ? 'Terima kasih, laporan aktivitasmu hari ini sudah tercatat.'
          : 'Catat aktivitas magangmu agar riwayat kehadiran tetap terbarui.'}
      </p>

      </div>

      <button
        type="button"
        onClick={() => pindah('laporan')}
className="mt-5 flex min-h-14 w-full items-center justify-between rounded-2xl bg-gradient-to-r from-blue-800 via-blue-700 to-teal-700 px-4 py-3 font-bold text-white shadow-lg shadow-blue-900/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
>
        <span className="flex items-center gap-3">
          <Ikon nama="clipboard" ukuran={21} />
          {sudahHariIni ? 'Lihat Riwayat Laporan' : 'Isi Laporan Hari Ini'}
        </span>

        <span className="text-2xl leading-none">›</span>
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-neutral">
        <Ikon nama="clock" ukuran={15} />
        Waktu server mengikuti zona WITA (GMT+8)
      </div>
    </section>

    {/* Ringkasan aktivitas */}
    <section className="mt-5 grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => pindah('laporan')}
className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
  >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
          <Ikon nama="calendar" ukuran={19} />
        </span>
        <p className="mt-3 text-2xl font-extrabold">{total}</p>
        <p className="mt-1 text-xs text-neutral">Total laporan</p>
      </button>

      <button
        type="button"
        onClick={() => pindah('perkembangan')}
        className="rounded-2xl border border-base-300 bg-base-100 p-4 text-left transition hover:border-primary/40"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Ikon nama="check" ukuran={19} />
        </span>
        <p className="mt-3 text-lg font-extrabold">
          {sudahHariIni ? 'Selesai' : 'Belum'}
        </p>
        <p className="mt-1 text-xs text-neutral">Laporan hari ini</p>
      </button>
    </section>

    {/* Laporan terbaru */}
    <section className={`${kartu} mt-5`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Laporan terbaru</h2>
        <button
          type="button"
          onClick={() => pindah('laporan')}
          className="text-sm font-bold text-primary hover:underline"
        >
          Lihat semua
        </button>
      </div>

      <DaftarLaporan
        data={laporan.slice(0, 3)}
        kosong={isiKosong}
      />
    </section>
  </Halaman>
)}


      {menuAktif === 'laporan' && (
        <Halaman
          judul="Riwayat Kehadiran"
          deskripsi="Pantau Kehadiran dan isi laporan magang harian"
          aksi={tombolKeluar}
          kartu={false}
        >
          <KalenderKehadiran
            laporan={laporan}
            onPilihTanggal={setTanggal}
          />
          <section className={kartu}>
            <h2 className="mb-5 text-lg font-bold">Buat laporan</h2>

            <form onSubmit={handleSimpanLaporan} className="flex flex-col gap-5">
              <div>
                <label htmlFor="tanggal-laporan" className="mb-2 block text-sm font-semibold">
                  Tanggal laporan
                </label>
                <input
                  id="tanggal-laporan"
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className={kelasInput}
                />
              </div>


              <div>
                <label htmlFor="status-kehadiran" className="mb-2 block text-sm font-semibold">
                  Status kehadiran
                </label>
                <select
                  id="status-kehadiran"
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value)}
                  className={kelasInput}
                >
                  <option value="HADIR">Hadir</option>
                  <option value="IZIN">Izin</option>
                  <option value="TIDAK_HADIR">Tidak hadir</option>
                </select>
              </div>

              <div className="rounded-2xl border border-base-300 p-4">
                <p className="text-sm font-semibold">Lokasi GPS</p>
                <p className="mt-1 text-xs text-neutral">
                  Izinkan akses lokasi di browser untuk melampirkan koordinat saat laporan dikirim.
                </p>

                <button
                  type="button"
                  disabled={mengambilGPS}
                  onClick={() => {
                    if (!navigator.geolocation) {
                      setPesanError('Browser ini tidak mendukung GPS.')
                      return
                    }

                    setMengambilGPS(true)
                    navigator.geolocation.getCurrentPosition(
                      (posisi) => {
                        setLatitude(posisi.coords.latitude)
                        setLongitude(posisi.coords.longitude)
                        setPesanError('')
                        setMengambilGPS(false)
                      },
                      () => {
                        setPesanError('Lokasi gagal diambil. Izinkan akses lokasi lalu coba lagi.')
                        setMengambilGPS(false)
                      },
                      { enableHighAccuracy: true, timeout: 10000 }
                    )
                  }}
                  className="mt-3 rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold hover:bg-base-200 disabled:opacity-50"
                >
                  {mengambilGPS ? 'Mengambil lokasi…' : 'Ambil lokasi saya'}
                </button>

                <p className="mt-2 text-xs text-neutral">
                  {latitude !== null && longitude !== null
                    ? `Lokasi berhasil diambil: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
                    : 'Lokasi belum dilampirkan.'}
                </p>
              </div>

              <div>
                <label htmlFor="problem-laporan" className="mb-2 block text-sm font-semibold">
                  Masalah
                </label>
                <textarea
                  id="problem-laporan"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Apa yang dikerjakan / masalah yang dihadapi?"
                  rows={3}
                  className={kelasTextarea}
                />
              </div>

              <div>
                <label htmlFor="solving-laporan" className="mb-2 block text-sm font-semibold">
                  Penyelesaian
                </label>
                <textarea
                  id="solving-laporan"
                  value={solving}
                  onChange={(e) => setSolving(e.target.value)}
                  placeholder="Bagaimana masalah itu diselesaikan?"
                  rows={3}
                  className={kelasTextarea}
                />
              </div>

              <div>
                <label htmlFor="kendala-laporan" className="mb-2 block text-sm font-semibold">
                  Kendala
                  <span className="ml-1 font-normal text-neutral">(opsional)</span>
                </label>
                <textarea
                  id="kendala-laporan"
                  value={kendala}
                  onChange={(e) => setKendala(e.target.value)}
                  placeholder="Kendala yang masih ada, jika ada..."
                  rows={2}
                  className={kelasTextarea}
                />
              </div>

              <div>
                <label htmlFor="saran-laporan" className="mb-2 block text-sm font-semibold">
                  Saran
                  <span className="ml-1 font-normal text-neutral">(opsional)</span>
                </label>
                <textarea
                  id="saran-laporan"
                  value={saran}
                  onChange={(e) => setSaran(e.target.value)}
                  placeholder="Saran untuk pembimbing atau tempat magang..."
                  rows={2}
                  className={kelasTextarea}
                />
              </div>

              {pesanError && (
                <p
                  role="alert"
                  className="rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error"
                >
                  {pesanError}
                </p>
              )}

              {pesanBerhasil && (
                <p
                  role="status"
                  className="rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary"
                >
                  {pesanBerhasil}
                </p>
              )}

              <button
                type="submit"
                disabled={menyimpan}
                className="btn btn-primary h-12 min-h-12 w-full rounded-xl border-0 text-sm font-bold shadow-lg shadow-primary/20"
              >
                {menyimpan && <span className="loading loading-spinner loading-sm" />}
                {menyimpan ? 'Menyimpan…' : 'Simpan laporan'}
              </button>
            </form>
          </section>

          <section className={`${kartu} mt-5`}>
            <h2 className="mb-4 text-lg font-bold">Riwayat laporan</h2>

            <div className="relative mb-4">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral">
                <Ikon nama="search" ukuran={18} />
              </span>
              <input
                type="search"
                value={pencarian}
                onChange={(e) => setPencarian(e.target.value)}
                placeholder="Cari laporan..."
                aria-label="Cari laporan"
                className={`${kelasInput} pl-10`}
              />
            </div>

            <DaftarLaporan
              data={laporanTampil}
              kosong={laporan.length === 0 ? isiKosong : 'Laporan tidak ditemukan.'}
            />

            <p className="mt-4 text-xs text-neutral">
              Menampilkan {laporanTampil.length} dari {total} laporan
            </p>
          </section>
        </Halaman>
      )}
      {menuAktif === 'perkembangan' && (
        <Perkembangan />
      )}
      <BottomNav aktif={menuAktif} onPindah={pindah} />
    </>
  )
}