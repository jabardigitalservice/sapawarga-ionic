import { Injectable } from '@angular/core';

@Injectable()
export class IntroConstants {
  // local storages
  public introStorages: any = {
    lapor: 'intro-lapor'
  };

  public stepLapor = [
    {
      element: '#step1',
      intro:
        'Sampaikan laporan Anda melalui SMS langsung kepada instansi pemerintah Jawa Barat!'
    },
    {
      element: '#step1',
      intro:
        'Ketik laporan Anda dengan format: LAPORJABAR<spasi>SW_[nama]<spasi>[nama kab/kota]<spasi>[nama kecamatan]<spasi>[isi laporan]'
    },
    {
      element: '#step1',
      intro:
        'Sederhana, kan? Yuk, kirim laporan pertama Anda dengan KLIK menu ini!'
    }
  ];
}
