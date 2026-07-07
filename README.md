# 1DEA — One Data Environment Alamtri

Paket website statis yang siap dipublikasikan menggunakan GitHub Pages.

## Publikasi paling mudah

1. Buat repository baru di GitHub, misalnya `environmentalamtri`.
2. Pilih **Public** agar GitHub Pages gratis dapat digunakan.
3. Upload seluruh isi folder ini ke root repository. Jangan upload folder pembungkusnya.
4. Commit ke branch `main`.
5. Buka **Settings → Pages**.
6. Pada **Source**, pilih **Deploy from a branch**.
7. Pilih branch `main`, folder `/(root)`, lalu **Save**.
8. Tunggu proses deployment selesai.

URL default akan berbentuk:

`https://USERNAME.github.io/environmentalamtri/`

## Custom domain

Tambahkan domain melalui **Settings → Pages → Custom domain** terlebih dahulu, kemudian ubah DNS pada penyedia domain. Jangan memasukkan password, data sensitif, dokumen rahasia, atau API key ke repository publik.

## Batas GitHub Pages

GitHub Pages hanya menjalankan HTML, CSS, dan JavaScript statis. PHP, MySQL, login server-side, upload dokumen, dan database tidak dapat dijalankan langsung. Untuk fitur tersebut, gunakan backend terpisah seperti Supabase/Firebase/API atau layanan hosting aplikasi.
