
import { useMemo, useState } from 'react'

const namaBulan = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const hari = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

function buatTanggal(tahun, bulan, tanggal) {
  return new Date(tahun, bulan, tanggal, 12)
}

function formatISO(date) {
  const tahun = date.getFullYear()
  const bulan = String(date.getMonth() + 1).padStart(2, '0')
  const tanggal = String(date.getDate()).padStart(2, '0')
  return `${tahun}-${bulan}-${tanggal}`
}

function periodeDariTanggal(date) {
  if (date.getDate() >= 16) {
    return {
      mulai: buatTanggal(date.getFullYear(), date.getMonth(), 16),
      selesai: buatTanggal(date.getFullYear(), date.getMonth() + 1, 15),
    }
  }

  return {
    mulai: buatTanggal(date.getFullYear(), date.getMonth() - 1, 16),
    selesai: buatTanggal(date.getFullYear(), date.getMonth(), 15),
  }
}

function ikonStatus(laporan) {
  if (!laporan) return null

  if (laporan.approvalStatus === 'DITOLAK') {
    return { simbol: '×', warna: 'text-red-600', label: 'Ditolak' }
  }

  if (laporan.approvalStatus === 'PERLU_TINDAKAN') {
    return { simbol: '▲', warna: 'text-amber-600', label: 'Perlu tindakan' }
  }

  if (laporan.approvalStatus === 'DISETUJUI') {
    if (laporan.attendanceStatus === 'IZIN') {
      return { simbol: '−', warna: 'text-emerald-600', label: 'Izin disetujui' }
    }

    if (laporan.attendanceStatus === 'TIDAK_HADIR') {
      return { simbol: '×', warna: 'text-red-600', label: 'Tidak hadir' }
    }

    return { simbol: '✓', warna: 'text-emerald-600', label: 'Hadir disetujui' }
  }

  return { simbol: '●', warna: 'text-sky-600', label: 'Menunggu persetujuan' }
}

export default function KalenderKehadiran({ laporan = [], onPilihTanggal }) {
  const [acuan, setAcuan] = useState(() => periodeDariTanggal(new Date()).mulai)
  const [tanggalDipilih, setTanggalDipilih] = useState(formatISO(new Date()))

  const periode = useMemo(() => {
    const mulai = acuan
    const selesai = buatTanggal(acuan.getFullYear(), acuan.getMonth() + 1, 15)
    const jumlahHari = Math.round((selesai - mulai) / 86400000) + 1

    const offset = (mulai.getDay() + 6) % 7
    const sel = []

    for (let i = 0; i < offset; i++) sel.push(null)

    for (let i = 0; i < jumlahHari; i++) {
      sel.push(buatTanggal(mulai.getFullYear(), mulai.getMonth(), 16 + i))
    }

    while (sel.length % 7 !== 0) sel.push(null)

    return { mulai, selesai, sel }
  }, [acuan])

  const laporanPerTanggal = useMemo(() => {
    const hasil = {}

    for (const item of laporan) {
      if (item.date) hasil[item.date.slice(0, 10)] = item
    }

    return hasil
  }, [laporan])

  const tanggalAktif = laporanPerTanggal[tanggalDipilih]
  const tanggalMulai = `${periode.mulai.getDate()} ${namaBulan[periode.mulai.getMonth()]}`
  const tanggalSelesai = `${periode.selesai.getDate()} ${namaBulan[periode.selesai.getMonth()]} ${periode.selesai.getFullYear()}`

  function pilihTanggal(date) {
    const iso = formatISO(date)
    setTanggalDipilih(iso)
    onPilihTanggal?.(iso)
  }

  function geserPeriode(jumlah) {
    const baru = buatTanggal(acuan.getFullYear(), acuan.getMonth() + jumlah, 16)
    setAcuan(baru)
    setTanggalDipilih(formatISO(baru))
    onPilihTanggal?.(formatISO(baru))
  }

  return (
    <section className="rounded-3xl border border-white/80 bg-base-100 p-5 shadow-xl shadow-slate-300/30 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Riwayat Kehadiran</h2>
          <p className="mt-1 text-sm text-neutral">
            {tanggalMulai} – {tanggalSelesai}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => geserPeriode(-1)}
            aria-label="Periode sebelumnya"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-base-300 hover:bg-base-200"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => geserPeriode(1)}
            aria-label="Periode berikutnya"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-base-300 hover:bg-base-200"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {hari.map((nama) => (
          <div key={nama} className="py-2 text-xs font-semibold text-neutral">
            {nama}
          </div>
        ))}

        {periode.sel.map((date, index) => {
          if (!date) return <div key={`kosong-${index}`} />

          const iso = formatISO(date)
          const status = ikonStatus(laporanPerTanggal[iso])
          const dipilih = iso === tanggalDipilih
          const hariIni = iso === formatISO(new Date())

          return (
            <button
              key={iso}
              type="button"
              onClick={() => pilihTanggal(date)}
              aria-label={`${iso}${status ? `, ${status.label}` : ', belum ada laporan'}`}
              className={`relative flex min-h-12 flex-col items-center justify-center rounded-xl text-sm transition ${
                dipilih
                  ? 'bg-primary text-white'
                  : 'hover:bg-base-200'
              } ${hariIni && !dipilih ? 'ring-1 ring-primary' : ''}`}
            >
              <span>{date.getDate()}</span>
              {status && (
                <span className={`text-xs font-bold ${dipilih ? 'text-white' : status.warna}`}>
                  {status.simbol}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral">
        <span><b className="text-sky-600">●</b> Menunggu persetujuan</span>
        <span><b className="text-emerald-600">✓</b> Disetujui</span>
        <span><b className="text-red-600">×</b> Ditolak / tidak hadir</span>
        <span><b className="text-amber-600">▲</b> Perlu tindakan</span>
      </div>

      <div className="mt-5 rounded-2xl bg-base-200/70 p-4">
        <p className="text-sm font-bold">
          {new Date(`${tanggalDipilih}T12:00:00`).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>

        {tanggalAktif ? (
          <>
            <p className="mt-2 text-sm">
              Status: {tanggalAktif.attendanceStatus || 'HADIR'}
            </p>
            <p className="mt-1 text-sm text-neutral">
              {tanggalAktif.problem}
            </p>
            <p className="mt-2 text-xs text-neutral">
              Persetujuan: {tanggalAktif.approvalStatus || 'MENUNGGU'}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-neutral">
            Belum ada laporan pada tanggal ini.
          </p>
        )}
      </div>
    </section>
  )
}
