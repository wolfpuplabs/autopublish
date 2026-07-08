import { put } from '@vercel/blob';

// Menonaktifkan bodyParser bawaan Vercel agar bisa membaca file stream berukuran besar
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Metode tidak diizinkan' });
  }

  try {
    // Mengambil nama asli file dari header yang dikirim oleh frontend HTML
    const filename = request.headers['x-filename'] || 'instagram-post.jpg';

    // Mengunggah stream data langsung ke Vercel Blob secara privat/aman
    const blob = await put(filename, request, {
      access: 'public', // Membuat file dapat diakses publik (Syarat dari Meta API)
    });

    // Mengembalikan data blob (termasuk URL publik gambar) ke frontend HTML
    return response.status(200).json(blob);
  } catch (error) {
    return response.status(500).json({ error: `Gagal upload: ${error.message}` });
  }
}
