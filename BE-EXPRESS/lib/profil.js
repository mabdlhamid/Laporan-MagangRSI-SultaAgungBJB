async function panggil(url, token, opsi = {}) {
  const res = await fetch(url, {
    ...opsi,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.message || 'Terjadi kesalahan.')
    err.status = res.status
    throw err
  }
  return data
}

// bentuk server (name) → bentuk form (nama)
const dariServer = (u) => ({
  nama: u.name || '',
  email: u.email || '',
  telepon: u.telepon || '',
  institusi: u.institusi || '',
  jurusan: u.jurusan || '',
  divisi: u.divisi || '',
  bio: u.bio || '',
})

export async function ambilProfil(token) {
  return dariServer(await panggil('/profile', token))
}

export async function simpanProfil(token, p) {
  const data = await panggil('/profile', token, {
    method: 'PATCH',
    body: JSON.stringify({
      name: p.nama,
      email: p.email,
      telepon: p.telepon,
      institusi: p.institusi,
      jurusan: p.jurusan,
      divisi: p.divisi,
      bio: p.bio,
    }),
  })
  return dariServer(data)
}