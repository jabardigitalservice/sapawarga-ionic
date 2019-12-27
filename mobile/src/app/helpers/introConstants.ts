import { Injectable } from '@angular/core';

@Injectable()
export class IntroConstants {
  // local storages
  public introStorages: any = {
    lapor: 'intro-lapor',
    questionAndAnswer: 'intro-question-and-answer'
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

  public stepQuestionAndAnswer1 = [
    {
      element: '#qna-step1',
      intro: 'Tuliskan pertanyaan anda disini'
    }
  ];

  public stepQuestionAndAnswer2 = [
    {
      element: '#qna-step2',
      intro:
        'Kirim pertanyaan anda dengan menekan tombol ini (tombol kirim pesan)'
    }
  ];

  public stepQuestionAndAnswer3 = [
    {
      intro:
        'Pertanyaan yang paling banyak disukai akan muncul dipaling atas dan direspon pertanyaannya oleh Pak Gubernur'
    }
  ];
}
