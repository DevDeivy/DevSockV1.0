import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegexValidator } from '../../services/regex-validator';
import { RouterLink } from "@angular/router";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-send-email',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './send-email.html',
  styleUrl: './send-email.css',
})
export class SendEmail {
  sendEmail!: FormGroup;
  private _regexService = inject(RegexValidator)

  constructor(private modal: MatDialog){}

  ngOnInit(): void {
      this.sendEmail = new FormGroup({
        email: new FormControl('', [Validators.email, Validators.required, Validators.pattern(this._regexService.email)]),
      })
  }

  openModal(){
    this.modal.open(Modal , {width: '1200px', height: '650px'});
  }

  sendCode(){

  }
}