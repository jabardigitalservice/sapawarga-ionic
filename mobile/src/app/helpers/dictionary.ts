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

  // confirmation message
  logout = 'Apakah Anda yakin ingin keluar dari aplikasi Sapawarga?',

  // message handle error
  terjadi_kesalahan = 'Terjadi kesalahan',
  error_permission = 'Silahkan periksa kembali permission anda',

  // polling message
  success_polling = 'Terima kasih anda sudah mengisi polling',
  have_done_vote = 'Anda sudah melakukan polling ini sebelumnya',

  // view profile message
  complete_sosmed = 'Mohon lengkapi akun sosial media anda',

  // login message
  // tslint:disable-next-line:max-line-length
  forgot_password = 'Anda dapat menghubungi Call Center Sapawarga <a href="tel:082315192724"><strong>082315192724</strong></a>  atau menghubungi email berikut  <a href="mailto:digital.service@jabarprov.go.id"><strong>digital.service@jabarprov.go.id</strong></a>',
  success_forgot_password = 'Email was sended successfully.',
  disconnected = 'network was disconnected :-(',
  confirmation_login = 'Pastikan input data terisi dengan benar',
  hak_cipta = 'Hak Cipta Pemerintah Provinsi Jawa Barat 2019',
  success_download = 'File berhasil diunduh',
  unsuccess_download = 'File gagal diunduh',
  msg_exit_app = 'Tekan sekali lagi untuk keluar aplikasi'
}
