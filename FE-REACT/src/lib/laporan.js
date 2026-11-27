import { panggil } from './profil.js'

// → { data: [...laporan], meta: { total, ... } }
export function ambilLaporan(token) {
  return panggil('/reports?limit=50', token)
}

export function buatLaporan(token, isi) {
  return panggil('/reports', token, {
    method: 'POST',
    body: JSON.stringify(isi),
  })
}