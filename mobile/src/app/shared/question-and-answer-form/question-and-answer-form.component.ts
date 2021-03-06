import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Dictionary } from '../../helpers/dictionary';
import { UtilitiesService } from '../../services/utilities.service';
import { QuestionAndAnswerService } from '../../services/question-and-answer.service';
import { Constants } from '../../helpers/constants';
import { ShowIntroService } from '../../services/show-intro.service';
import { IntroConstants } from '../../helpers/introConstants';

@Component({
  selector: 'app-question-and-answer-form',
  templateUrl: './question-and-answer-form.component.html',
  styleUrls: ['./question-and-answer-form.component.scss']
})
export class QuestionAndAnswerFormComponent implements OnInit {
  public AddQnAForm: FormGroup;
  submitted = false;
  isIntro = false;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private util: UtilitiesService,
    private questionAndAnswerService: QuestionAndAnswerService,
    private constants: Constants,
    private showIntroService: ShowIntroService,
    private introConstants: IntroConstants
  ) {}

  ngOnInit() {
    this.AddQnAForm = this.formBuilder.group({
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(255)
        ]
      ]
    });
  }

  ionViewDidEnter() {
    this.isIntro = JSON.parse(
      localStorage.getItem(this.introConstants.introStorages.questionAndAnswer)
    );

    if (!this.isIntro) {
      this.showIntro();
    }
  }

  showIntro() {
    this.showIntroService.showIntroQnA(
      2,
      this.introConstants.stepQuestionAndAnswer2,
      'app-question-and-answer-form'
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.AddQnAForm.controls;
  }

  dismiss() {
    // dismiss modal
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  async submitQna() {
    this.submitted = true;
    // check form if invalid
    if (this.AddQnAForm.invalid) {
      return;
    }

    // check internet
    if (!navigator.onLine) {
      this.util.showToast(Dictionary.offline);
      return;
    }

    const loader = await this.loadingCtrl.create({
      duration: 10000
    });
    loader.present();

    const buttons = [
      {
        text: 'OK',
        handler: () => {
          this.dismiss();
        }
      }
    ];

    this.questionAndAnswerService
      .PostNewQnA(this.f.description.value)
      .subscribe(
        res => {
          if (res['success'] === true) {
            loader.dismiss();
            this.util.alertConfirmation(
              Dictionary.question_success,
              buttons,
              'Selamat'
            );

            // save new QnA to local
            this.questionAndAnswerService.saveLocal(
              this.constants.localStorage.newQnA,
              res['data']
            );

            // google event analytics
            this.util.trackEvent(
              this.constants.pageName.QnA,
              'create_question_tanya_jawab',
              this.f.description.value,
              1
            );
          } else {
            loader.dismiss();
            this.util.alertConfirmation(Dictionary.terjadi_kesalahan, ['OK']);
          }
        },
        _ => {
          loader.dismiss();
          this.util.alertConfirmation(Dictionary.terjadi_kesalahan, ['OK']);
        }
      );

    this.submitted = false;
    this.AddQnAForm.reset();
  }
}
