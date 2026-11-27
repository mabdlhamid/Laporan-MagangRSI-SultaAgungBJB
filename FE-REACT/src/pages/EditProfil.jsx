
import { useState } from 'react'
import Halaman from '../components/Halaman.jsx'

const kelasInput =
  'h-12 w-full rounded-xl border border-base-300 bg-base-100 px-4 text-sm outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-4 focus:ring-primary/10'

const kolom = [
  { name: 'nama', label: 'Nama lengkap', placeholder: 'Nama lengkap kamu' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'nama@email.com' },
  { name: 'telepon', label: 'No. telepon', type: 'tel', opsional: true, placeholder: '08xxxxxxxxxx' },
  { name: 'institusi', label: 'Asal institusi', opsional: true, placeholder: 'Universitas / sekolah' },
  { name: 'jurusan', label: 'Jurusan', opsional: true, placeholder: 'Contoh: Teknik Informatika' },
  { name: 'divisi', label: 'Divisi penempatan', opsional: true, placeholder: 'Contoh: Web Development' },
]

function NilaiProfil({ label, nilai }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-base-300 py-3 last:border-0">
      <span className="text-sm text-neutral">{label}</span>
      <span className="max-w-[60%] break-words text-right text-sm font-semibold">
        {nilai || 'Belum diisi'}
      </span>
    </div>
  )
}

function Field({ id, label, opsional, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
        {opsional && (
          <span className="ml-1 font-normal text-neutral">(opsional)</span>
        )}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-error">
          {error}
        </p>
      )}
    </div>
  )
}

export default function EditProfil({ profil, onSimpan, onBatal }) {
  const [sedangEdit, setSedangEdit] = useState(false)
  const [form, setForm] = useState({
    nama: profil.nama || '',
    email: profil.email || '',
    telepon: profil.telepon || '',
    institusi: profil.institusi || '',
    jurusan: profil.jurusan || '',
    divisi: profil.divisi || '',
    bio: profil.bio || '',
  })
  const [error, setError] = useState({})
  const [berhasil, setBerhasil] = useState(false)
  const [menyimpan, setMenyimpan] = useState(false)

  const nama = profil.nama || 'Peserta Magang'
  const inisial = (nama.trim().charAt(0) || '?').toUpperCase()

  function mulaiEdit() {
    setForm({
      nama: profil.nama || '',
      email: profil.email || '',
      telepon: profil.telepon || '',
      institusi: profil.institusi || '',
      jurusan: profil.jurusan || '',
      divisi: profil.divisi || '',
      bio: profil.bio || '',
    })
    setError({})
    setBerhasil(false)
    setSedangEdit(true)
  }

  function ubah(e) {
    const { name, value } = e.target
    setForm((sebelumnya) => ({ ...sebelumnya, [name]: value }))
    setBerhasil(false)
  }

  function validasi() {
    const hasil = {}

    if (!form.nama.trim()) {
      hasil.nama = 'Nama lengkap wajib diisi.'
    }

    if (!form.email.trim()) {
      hasil.email = 'Email wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      hasil.email = 'Format email tidak valid.'
    }

    if (form.telepon.trim() && !/^[0-9+\-\s]{8,16}$/.test(form.telepon.trim())) {
      hasil.telepon = 'Nomor telepon tidak valid.'
    }

    return hasil
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const hasil = validasi()
    setError(hasil)

    if (Object.keys(hasil).length > 0) return

    setMenyimpan(true)

    try {
      await onSimpan({
        nama: form.nama.trim(),
        email: form.email.trim(),
        telepon: form.telepon.trim(),
        institusi: form.institusi.trim(),
        jurusan: form.jurusan.trim(),
        divisi: form.divisi.trim(),
        bio: form.bio.trim(),
      })

      setBerhasil(true)
      setSedangEdit(false)
    } catch (err) {
      setError({ umum: err.message || 'Gagal menyimpan profil.' })
    } finally {
      setMenyimpan(false)
    }
  }

  return (
    <Halaman
      judul={sedangEdit ? 'Edit Profil' : 'Akun Peserta'}
      deskripsi={
        sedangEdit
          ? 'Perbarui data diri dan informasi magang kamu.'
          : 'Kelola informasi akun dan program magang kamu.'
      }
      kartu={false}
    >
      {!sedangEdit ? (
        <div className="space-y-5">
          {berhasil && (
            <p
              role="status"
              className="rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm font-semibold text-success"
            >
              Profil berhasil disimpan.
            </p>
          )}

          {/* Kartu identitas peserta */}
          <section className="rounded-3xl border border-base-300/70 bg-base-100 p-5 shadow-lg shadow-slate-200/40 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-extrabold text-primary ring-1 ring-primary/20">
                {inisial}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="break-words text-lg font-bold">{nama}</h2>
                <p className="mt-1 text-sm text-neutral">Peserta Magang</p>

                <div className="mt-3 space-y-2">
                  <p className="flex items-start gap-2 break-all text-sm">
                    <span aria-hidden="true">✉</span>
                    <span>{profil.email || 'Email belum diisi'}</span>
                  </p>
                  <p className="flex items-start gap-2 text-sm">
                    <span aria-hidden="true">☎</span>
                    <span>{profil.telepon || 'Nomor telepon belum diisi'}</span>
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={mulaiEdit}
              className="btn btn-primary mt-5 h-12 min-h-12 w-full rounded-xl border-0 text-sm font-bold"
            >
              Edit Profil
            </button>
          </section>

          {/* Informasi magang */}
          <section className="rounded-3xl border border-base-300/70 bg-base-100 p-5 shadow-lg shadow-slate-200/40 sm:p-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Informasi Magang</h2>
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                Peserta
              </span>
            </div>

            <NilaiProfil label="Institusi" nilai={profil.institusi} />
            <NilaiProfil label="Jurusan" nilai={profil.jurusan} />
            <NilaiProfil label="Posisi / Divisi" nilai={profil.divisi} />

            <div className="border-t border-base-300 pt-3">
              <p className="mb-1 text-sm text-neutral">Tentang saya</p>
              <p className="whitespace-pre-wrap break-words text-sm leading-6">
                {profil.bio || 'Bio belum diisi.'}
              </p>
            </div>
          </section>

          {/* Informasi pengunduran diri */}
          <section className="rounded-3xl border border-base-300/70 bg-base-100 p-5 shadow-lg shadow-slate-200/40 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-error/10 text-xl text-error">
                ↪
              </div>
              <div>
                <h2 className="font-bold">Pengunduran Diri</h2>
                <p className="mt-1 text-sm leading-5 text-neutral">
                  Jika ingin mengajukan pengunduran diri, silakan hubungi
                  pembimbing atau pengelola program magang.
                </p>
              </div>
            </div>
          </section>

          <button
            type="button"
            onClick={onBatal}
            className="h-12 w-full rounded-xl border border-base-300 bg-base-100 text-sm font-semibold transition hover:bg-base-200"
          >
            Kembali ke Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-100 p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-extrabold text-primary">
              {(form.nama.trim().charAt(0) || '?').toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="break-words font-bold">
                {form.nama.trim() || 'Nama peserta'}
              </p>
              <p className="mt-1 text-xs text-neutral">Peserta Magang</p>
            </div>
          </div>

          {kolom.map((k) => (
            <Field
              key={k.name}
              id={`profil-${k.name}`}
              label={k.label}
              opsional={k.opsional}
              error={error[k.name]}
            >
              <input
                id={`profil-${k.name}`}
                name={k.name}
                type={k.type || 'text'}
                value={form[k.name]}
                onChange={ubah}
                placeholder={k.placeholder}
                className={kelasInput}
              />
            </Field>
          ))}

          <Field id="profil-bio" label="Bio singkat" opsional>
            <textarea
              id="profil-bio"
              name="bio"
              value={form.bio}
              onChange={ubah}
              rows={3}
              placeholder="Ceritakan sedikit tentang diri kamu..."
              className="w-full resize-y rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-sm outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </Field>

          {error.umum && (
            <p role="alert" className="rounded-xl bg-error/5 px-4 py-3 text-sm font-medium text-error">
              {error.umum}
            </p>
          )}

          <div className="flex flex-col gap-3 border-t border-base-300 pt-5 sm:flex-row">
            <button
              type="submit"
              disabled={menyimpan}
              className="btn btn-primary h-12 min-h-12 flex-1 rounded-xl border-0 text-sm font-bold"
            >
              {menyimpan ? 'Menyimpan…' : 'Simpan perubahan'}
            </button>

            <button
              type="button"
              disabled={menyimpan}
              onClick={() => {
                setError({})
                setSedangEdit(false)
              }}
              className="h-12 rounded-xl border border-base-300 bg-base-100 px-5 text-sm font-semibold transition hover:bg-base-200 disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </Halaman>
  )
}
