
import Halaman from '../components/Halaman.jsx'

const menuPerkembangan = [
  {
    judul: 'Kurikulum',
    deskripsi: 'Kurikulum Magang dan Fokus Pembelajaran',
    ikon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" className="h-6 w-6">
        <path d="M3 5.5A3.5 3.5 0 0 1 6.5 2H12v18H6.5A3.5 3.5 0 0 0 3 23z" />
        <path d="M21 5.5A3.5 3.5 0 0 0 17.5 2H12v18h5.5a3.5 3.5 0 0 1 3.5 3z" />
      </svg>
    ),
    warna: 'bg-purple-100 text-purple-600',
  },
  {
    judul: 'Evaluasi Bulanan',
    deskripsi: 'Penilaian Mentor per periode',
    ikon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" className="h-6 w-6">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h8" />
      </svg>
    ),
    warna: 'bg-blue-100 text-blue-600',
  },
  {
    judul: 'Uang Saku',
    deskripsi: 'Rincian pembayaran per periode',
    ikon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" className="h-6 w-6">
        <rect x="3" y="6" width="18" height="15" rx="2" />
        <path d="M3 9h18M16 14h2" />
        <path d="M6 6V4a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    warna: 'bg-orange-100 text-orange-600',
  },
  {
    judul: 'Survei',
    deskripsi: 'Survei dan umpan balik program magang',
    ikon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" className="h-6 w-6">
        <rect x="4" y="4" width="16" height="18" rx="2" />
        <path d="M9 2h6v4H9zM8 12l2 2 4-4M8 18h8" />
      </svg>
    ),
    warna: 'bg-green-100 text-green-600',
  },
]

export default function Perkembangan() {
  return (
    <Halaman
      judul="Perkembangan Magang"
      deskripsi="Lihat kurikulum, evaluasi bulanan, pembayaran uang saku, dan survei program Anda."
      kartu={false}
    >
      <div className="space-y-4">
        {menuPerkembangan.map((item) => (
          <button
            key={item.judul}
            type="button"
            onClick={() => {
              alert(`${item.judul} belum tersedia.`)
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-base-300/70 bg-base-100 p-4 text-left shadow-sm transition hover:border-primary/30 hover:shadow-md sm:gap-4 sm:p-5"
          >
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.warna}`}
            >
              {item.ikon}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block font-bold">{item.judul}</span>
              <span className="my-2 block border-t border-base-300" />
              <span className="block text-xs leading-5 text-neutral sm:text-sm">
                {item.deskripsi}
              </span>
            </span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5 shrink-0"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ))}
      </div>
    </Halaman>
  )
}
