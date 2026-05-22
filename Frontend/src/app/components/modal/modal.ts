import { AfterViewInit, Component, ElementRef, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { RegexValidator } from '../../services/regex-validator';
import { UsersService } from '../../services/users-service';
import { catchError, EMPTY } from 'rxjs';
import { EmailService } from '../../services/email-service';

@Component({
  selector: 'app-modal',
  imports: [MatDialogModule, MatStepperModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal implements OnInit{

  // @ViewChild('inputcode') inputCode!: ElementRef;

  verificated = false;
  code!: FormGroup;
  resetPassword!: FormGroup;
  private _regexService = inject(RegexValidator)
  private _userService = inject(UsersService)
  private _emailService = inject(EmailService)

  constructor(@Inject(MAT_DIALOG_DATA) public data: {email: string}){}

  codeVerificate(stepper: MatStepper){
    this.verificated = true;
    setTimeout(() => stepper.next(), 0);
  }

  ngOnInit(): void {
    this.code = new FormGroup({
      codeV: new FormControl('', [Validators.required, Validators.pattern(this._regexService.code)]),
    })

    this.resetPassword = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.pattern(this._regexService.password)]),
      confirmPassword: new FormControl('', [Validators.required]),
    })
  }

  // ngAfterViewInit(){
  //   this.inputCode.nativeElement.focus();
  // }

  confirm(){
    return this.resetPassword?.get('password')?.value !== this.resetPassword?.get('confirmPassword')?.value
  }

  validateCode(){
    this._emailService.validateCode(this.code.value).pipe(catchError(err => {
      console.log(err);
      return EMPTY
    }))
    .subscribe(res =>{ 
      console.log(res);
      return this.verificated = true;
    })
  }

  resetPasswordStep(){
    this._userService.resetPasswordUser(this.resetPassword.value).pipe(catchError(err => {
      console.log(err);
      return EMPTY
    }))
    .subscribe(res => {
      console.log(res);
      return this.verificated = true;
    })
  }
}
