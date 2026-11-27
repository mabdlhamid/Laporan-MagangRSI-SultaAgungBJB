
const ikon = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'h-5 w-5',
  'aria-hidden': true,
}

const menu = [
  {
    id: 'dashboard',
    label: 'Beranda',
    gambar: (
      <svg {...ikon}>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-6h4v6" />
      </svg>
    ),
  },
  {
    id: 'laporan',
    label: 'Riwayat',
    gambar: (
      <svg {...ikon}>
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16M8 14l2 2 5-4" />
      </svg>
    ),
  },
  {
    id: 'perkembangan',
    label: 'Perkembangan',
    gambar: (
      <svg {...ikon}>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h3" />
      </svg>
    ),
  },
  {
    id: 'profil',
    label: 'Akun',
    gambar: (
      <svg {...ikon}>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
      </svg>
    ),
  },
]

export default function BottomNav({ aktif, onPindah }) {
  return (
    <nav
      aria-label="Menu utama"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center border-t border-base-300 bg-base-100/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm"
    >
      <div className="flex w-full max-w-lg">
        {menu.map((m) => {
          const nyala = aktif === m.id

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onPindah(m.id)}
              aria-current={nyala ? 'page' : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition sm:text-xs ${
                nyala
                  ? 'text-primary'
                  : 'text-neutral hover:text-primary'
              }`}
            >
              <span
                className={`flex h-8 w-9 items-center justify-center rounded-xl ${
                  nyala ? 'bg-primary/10' : ''
                }`}
              >
                {m.gambar}
              </span>
              <span className="text-center leading-tight">
                {m.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
