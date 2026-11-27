export default function Halaman({ judul, deskripsi, aksi, kartu = true, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-base-200 pb-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-32 h-[440px] w-[440px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-md px-4 pt-8 sm:pt-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold tracking-tight">{judul}</h1>
            {deskripsi && <p className="mt-1 text-sm text-neutral">{deskripsi}</p>}
          </div>
          {aksi}
        </div>

        <div className="mt-6">
          {kartu ? (
            <section className="rounded-3xl border border-white/80 bg-base-100/95 p-6 shadow-2xl shadow-slate-300/40 backdrop-blur-sm">
              {children}
            </section>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  )
}