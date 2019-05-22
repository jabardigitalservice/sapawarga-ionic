import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-aspirasi-add',
  templateUrl: './aspirasi-add.page.html',
  styleUrls: ['./aspirasi-add.page.scss']
})
export class AspirasiAddPage implements OnInit {
  formAddAspirasi: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formAddAspirasi = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(4),
          Validators.pattern(/^[A-Za-z ]+$/)
        ]
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(4)
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(12)]
      ],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      kabkota_id: ['']
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.formAddAspirasi.controls;
  }

  async onFormSubmit(form: NgForm) {
    console.log(form);
    this.submitted = true;
    // check form if invalid
    if (this.formAddAspirasi.invalid) {
      return;
    }
  }
}
