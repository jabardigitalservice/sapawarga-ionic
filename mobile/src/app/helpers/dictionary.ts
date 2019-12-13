export enum Dictionary {
  // message response
  empty = 'Data tidak ditemukan',
  offline = 'Tidak ada jaringan internet',
  internalError = 'server sedang dalam perbaikan',
  failed_save = 'Data gagal tersimpan',
  success_save = 'Data berhasil tersimpan',
  external_error = 'Data gagal tersimpan periksa kembali koneksi internet anda',
  check_internal = 'Terjadi kesalahan periksa kembali koneksi internet anda',
  confirm_gps = 'Untuk melanjutkan, mohon untuk mengaktifkan gps anda',
  max_upload_photo = 'Foto yang diupload melebihi batas max. file',

  // aspirasi message
  aspirasi_success_delete = 'Usulan berhasil dihapus',
  aspirasi_failed = 'Usulan gagal dihapus, periksa kembali koneksi internet Anda',
  aspirasi_confirm = 'Apakah Anda yakin ingin menghapus usulan ini?',
  empty_aspirasi = 'Belum ada usulan yang dibuat',
  aspirasi_limit_upload = 'Anda hanya dapat menyertakan maksimal lima foto saja',
  aspirasi_msg_send = 'apakah anda setuju untuk memberikan usulan untuk jawa barat?',
  aspirasi_msg_draft = 'Anda belum menyelesaikan posting Anda. Apakah ingin menyimpan sebagai draft?',

  // polling
  polling_empty = 'Belum ada polling yang diterima',
  polling_leave = 'Anda belum mengisi polling. Apakah anda ingin meninggalkan halaman polling?',

  // confirmation message
  logout = 'Apakah Anda yakin ingin keluar dari aplikasi Sapawarga?',

  // message handle error
  terjadi_kesalahan = 'Terjadi kesalahan',
  error_permission = 'Silahkan periksa kembali permission anda',

  // polling message
  success_polling = 'Terima kasih anda sudah mengisi polling',
  have_done_vote = 'Anda sudah melakukan polling ini sebelumnya',
  polling_not_found = 'Polling tidak ditemukan',

  // view profile message
  complete_sosmed = 'Mohon lengkapi akun sosial media anda',

  // login message
  success_forgot_password = 'Email was sended successfully.',
  disconnected = 'network was disconnected :-(',
  confirmation_login = 'Pastikan input data terisi dengan benar',
  hak_cipta = 'Hak Cipta Pemerintah Provinsi Jawa Barat 2019',
  success_download = 'File berhasil diunduh',
  unsuccess_download = 'File gagal diunduh',
  msg_exit_app = 'Tekan sekali lagi untuk keluar aplikasi',

  // version update
  msg_update_app = 'Versi terbaru telah tersedia. segera perbaharui aplikasi anda.',

  msg_saber_hoax = 'Tidak ada daftar Saber Hoax yang dibuat',
  // tslint:disable-next-line:max-line-length
  msg_wa_saber_hoax = 'Sampurasun, wargi! Terima kasih sudah menghubungi Jabar Saber Hoaks melalui SAPAWARGA. Silakan tulis laporan dan lampirkan tautan atau gambar dugaan hoaks di bawah ini.',
  msg_change_password = 'Kata sandi berhasil diubah',
  msg_forgot_password = 'Tautan reset password telah di kirim ke email anda',
  msg_error_forgot_password = 'Tidak ada user dengan email tersebut',

  // news message
  news_not_found = 'Berita tidak ditemukan',
  msg_news = 'Tidak ada daftar berita yang dibuat',

  // broadcast
  delete_broadcast = 'Apakah Anda yakin ingin menghapus pesan ini?',
  header_broadcast = 'Hapus Pesan',
  success_delete_broadcast = 'Pesan berhasil dihapus',

  // QnA
  question_success = 'Pertanyaan berhasil dikirim',

  // login
  // tslint:disable-next-line: max-line-length
  dialogDidNotRegister = '<div>Untuk mendapatkan username dan password, anda dapat menghubungi nomor berikut <br/><br/>whatsapp: <a href="https://wa.me/+6281212124023"><strong>081212124023</strong></a> <br/><br/>telepon: <a href="tel:081212124023"><strong>081212124023</strong></a>  </div>'
}
