
import { useState } from 'react'

const laporanContoh = [
  {
    id: 1,
    tanggal: '25 Nov 2026',
    kegiatan: 'Mempelajari React dan komponen',
    kendala: '',
    status: 'Selesai',
  },
  {
    id: 2,
    tanggal: '24 Nov 2026',
    kegiatan: 'Membuat halaman login MagangHub',
    kendala: '',
    status: 'Selesai',
  },
  {
    id: 3,
    tanggal: '23 Nov 2026',
    kegiatan: 'Mempelajari Express.js',
    kendala: '',
    status: 'Menunggu',
  },
]

function Ikon({ nama, ukuran = 20 }) {
  const props = {
    width: ukuran,
    height: ukuran,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'shrink-0',
    'aria-hidden': true,
  }

  const gambar = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9M9 20v-7h6v7" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h8" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    clipboard: (
      <>
        <rect x="5" y="5" width="14" height="17" rx="2" />
        <path d="M9 5V3h6v2M8 11h8M8 15h8" />
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
    close: <path d="m18 6-12 12M6 6l12 12" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 4 4" />
      </>
    ),
  }

  return <svg {...props}>{gambar[nama]}</svg>
}

export default function Dashboard({ sesi, onLogout }) {
  const nama = sesi?.name || 'Peserta Magang'

  const [laporan, setLaporan] = useState(laporanContoh)
  const [formTerbuka, setFormTerbuka] = useState(false)
  const [tanggal, setTanggal] = useState(
    new Date().toLocaleDateString('en-CA')
  )
  const [kegiatan, setKegiatan] = useState('')
  const [kendala, setKendala] = useState('')
  const [pesanError, setPesanError] = useState('')
  const [pencarian, setPencarian] = useState('')
  const [menuAktif, setMenuAktif] = useState('dashboard')

  const totalLaporan = laporan.length

  const laporanSelesai = laporan.filter(
    (item) => item.status === 'Selesai'
  ).length

  const laporanMenunggu = laporan.filter(
    (item) => item.status === 'Menunggu'
  ).length

  const laporanTampil = laporan.filter((item) => {
    const kata = pencarian.toLowerCase()

    return (
      item.kegiatan.toLowerCase().includes(kata) ||
      item.tanggal.toLowerCase().includes(kata) ||
      item.status.toLowerCase().includes(kata)
    )
  })

  function handleSimpanLaporan(e) {
    e.preventDefault()

    if (!tanggal || !kegiatan.trim()) {
      setPesanError('Tanggal dan kegiatan wajib diisi.')
      return
    }

    const tanggalFormat = new Date(
      `${tanggal}T00:00:00`
    ).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

    const laporanBaru = {
      id: Date.now(),
      tanggal: tanggalFormat,
      kegiatan: kegiatan.trim(),
      kendala: kendala.trim(),
      status: 'Menunggu',
    }

    setLaporan((sebelumnya) => [laporanBaru, ...sebelumnya])
    setKegiatan('')
    setKendala('')
    setPesanError('')
    setFormTerbuka(false)
    setMenuAktif('laporan')
  }

  function bukaForm() {
    setFormTerbuka(true)
    setPesanError('')
    setMenuAktif('laporan')
  }

  function bukaDashboard() {
    setMenuAktif('dashboard')
    setFormTerbuka(false)
    setPesanError('')
  }

  return (
    <div className="min-h-screen bg-[#f4f8f8] text-slate-800 md:flex">
      {/* Sidebar */}
      <aside className="flex w-full shrink-0 flex-col bg-[#103d40] text-white md:sticky md:top-0 md:h-screen md:w-64">
        <div className="border-b border-white/10 px-6 py-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-400 text-[#103d40]">
              <Ikon nama="clipboard" ukuran={25} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                MagangHub
              </h1>
              <p className="mt-1 text-xs text-teal-100/70">
                Internship Management
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-100/50">
            Menu utama
          </p>

          <nav className="space-y-2">
            <button
              type="button"
              onClick={bukaDashboard}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                menuAktif === 'dashboard'
                  ? 'bg-teal-400 text-[#103d40] shadow-sm'
                  : 'text-teal-50/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Ikon nama="home" />
              Dashboard
            </button>

            <button
              type="button"
              onClick={bukaForm}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                menuAktif === 'laporan'
                  ? 'bg-teal-400 text-[#103d40] shadow-sm'
                  : 'text-teal-50/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Ikon nama="file" />
              Laporan Harian
            </button>
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-teal-100/60">Login sebagai</p>
            <p className="mt-1 truncate text-sm font-semibold">
              {nama}
            </p>
            <p className="mt-1 text-xs text-teal-100/60">
              Peserta magang
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-teal-50/80 transition hover:bg-red-500/15 hover:text-red-200"
          >
            <Ikon nama="logout" />
            Keluar
          </button>

          <p className="mt-5 px-2 text-[11px] text-teal-100/40">
            MagangHub © 2026
          </p>
        </div>
      </aside>

      {/* Konten utama */}
      <main className="min-w-0 flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur md:px-9">
          <div className="relative min-w-0 flex-1 sm:max-w-md">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Ikon nama="search" ukuran={18} />
            </span>
            <input
              type="search"
              value={pencarian}
              onChange={(e) => setPencarian(e.target.value)}
              placeholder="Cari laporan..."
              aria-label="Cari laporan"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-500">Selamat datang,</p>
              <p className="max-w-48 truncate text-sm font-bold text-slate-800">
                {nama}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 font-bold text-teal-800 ring-1 ring-teal-100">
              {nama.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] p-5 md:p-9">
          {/* Judul halaman */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                Halaman utama
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                Dashboard
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Pantau dan kelola aktivitas magang kamu di sini.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
              <Ikon nama="calendar" ukuran={16} />
              {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>

          {/* Statistik */}
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total laporan
                  </p>
                  <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                    {totalLaporan}
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Ikon nama="clipboard" ukuran={24} />
                </div>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                Seluruh aktivitas tercatat
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Laporan selesai
                  </p>
                  <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-emerald-700">
                    {laporanSelesai}
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Ikon nama="check" ukuran={24} />
                </div>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                Aktivitas berstatus selesai
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Menunggu
                  </p>
                  <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-amber-600">
                    {laporanMenunggu}
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Ikon nama="clock" ukuran={24} />
                </div>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                Menunggu tindak lanjut
              </div>
            </div>
          </section>

          {/* Form tambah laporan */}
          {formTerbuka && (
            <section className="mb-8 overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 md:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Ikon nama="file" ukuran={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Buat laporan harian
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Catat aktivitas dan kendala magang.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFormTerbuka(false)
                    setPesanError('')
                  }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  <Ikon nama="close" ukuran={17} />
                  Tutup
                </button>
              </div>

              <form
                onSubmit={handleSimpanLaporan}
                className="space-y-5 p-5 md:p-7"
              >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                  <div>
                    <label
                      htmlFor="tanggal-laporan"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Tanggal laporan
                    </label>
                    <input
                      id="tanggal-laporan"
                      type="date"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      required
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="kegiatan-laporan"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Kegiatan
                    </label>
                    <textarea
                      id="kegiatan-laporan"
                      value={kegiatan}
                      onChange={(e) => setKegiatan(e.target.value)}
                      placeholder="Jelaskan kegiatan yang dilakukan..."
                      required
                      rows={3}
                      className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="kendala-laporan"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Kendala
                      <span className="ml-1 font-normal text-slate-400">
                        (opsional)
                      </span>
                    </label>
                    <textarea
                      id="kendala-laporan"
                      value={kendala}
                      onChange={(e) => setKendala(e.target.value)}
                      placeholder="Jelaskan kendala jika ada..."
                      rows={3}
                      className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>
                </div>

                {pesanError && (
                  <p role="alert" className="text-sm font-medium text-red-600">
                    {pesanError}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-600/20"
                  >
                    <Ikon nama="check" ukuran={18} />
                    Simpan laporan
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormTerbuka(false)
                      setPesanError('')
                    }}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Tabel laporan */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 md:px-7">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Laporan harian
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Riwayat aktivitas magang kamu.
                </p>
              </div>

              <button
                type="button"
                onClick={bukaForm}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-600/20"
              >
                <Ikon nama="plus" ukuran={18} />
                Buat laporan
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Kegiatan</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {laporanTampil.map((item) => (
                    <tr
                      key={item.id}
                      className="transition hover:bg-teal-50/30"
                    >
                      <td className="whitespace-nowrap px-6 py-5 font-medium text-slate-600">
                        {item.tanggal}
                      </td>

                      <td className="max-w-md px-6 py-5">
                        <p className="font-semibold leading-6 text-slate-800">
                          {item.kegiatan}
                        </p>
                        {item.kendala && (
                          <p className="mt-1.5 text-xs leading-5 text-slate-500">
                            Kendala: {item.kendala}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                            item.status === 'Selesai'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.status === 'Selesai'
                                ? 'bg-emerald-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {laporanTampil.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-12 text-center"
                      >
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                          <Ikon nama="search" ukuran={23} />
                        </div>
                        <p className="mt-3 font-semibold text-slate-700">
                          Laporan tidak ditemukan
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Coba gunakan kata pencarian yang lain.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-6 py-4">
              <p className="text-xs text-slate-500">
                Menampilkan {laporanTampil.length} dari {totalLaporan} laporan
              </p>
              <p className="text-xs font-medium text-slate-400">
                MagangHub · Portal kegiatan magang
              </p>
            </div>
          </section>

          <footer className="py-6 text-center text-xs text-slate-400">
            MagangHub © {new Date().getFullYear()} · Internship Management
          </footer>
        </div>
      </main>
    </div>
  )
}
