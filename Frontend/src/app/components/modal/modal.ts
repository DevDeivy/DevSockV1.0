import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { RegexValidator } from '../../services/regex-validator';

@Component({
  selector: 'app-modal',
  imports: [MatDialogModule, MatStepperModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal implements OnInit{

  verificated = false;
  code!: FormGroup;
  private _regexService = inject(RegexValidator)

  codeVerificate(stepper: MatStepper){
    this.verificated = true;
    setTimeout(() => stepper.next(), 0);
  }

  ngOnInit(): void {
    this.code = new FormGroup({
      codeV: new FormControl('', [Validators.required, Validators.pattern(this._regexService.code)]),
    })
  }

}
