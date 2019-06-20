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

  // aspirasi message
  aspirasi_success_delete = 'Aspirasi berhasil dihapus',
  aspirasi_failed = 'Aspirasi gagal dihapus, periksa kembali koneksi internet Anda',
  aspirasi_confirm = 'Apakah Anda yakin ingin menghapus aspirasi ini?',
  empty_aspirasi = 'Belum ada aspirasi yang dibuat',

  // confirmation message
  logout = 'Apakah Anda yakin ingin keluar dari aplikasi Sapawarga?',

  // message handle error
  terjadi_kesalahan = 'Terjadi kesalahan',
  error_permission = 'Silahkan periksa kembali permission anda',

  // polling message
  success_polling = 'Terima kasih anda sudah mengisi polling',
  have_done_vote = 'Anda sudah melakukan polling ini sebelumnya',

  // edit profile message
  max_upload_foto = 'Foto profile yang diupload melebihi batas max. file',

  // view profile message
  complete_sosmed = 'Mohon lengkapi akun sosial media anda',

  // login message
  forgot_password = 'Tuliskan email anda untuk mengatur ulang kata sandi',
  success_forgot_password = 'Email was sended successfully.',
  disconnected = 'network was disconnected :-(',
  confirmation_login = 'Pastikan input data terisi dengan benar'
}
