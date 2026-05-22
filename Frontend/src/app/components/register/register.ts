import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegexValidator } from '../../services/regex-validator';
import { RouterLink } from "@angular/router";
import { UsersService } from '../../services/users-service';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit{

  register!: FormGroup;
  private _regexService = inject(RegexValidator)
  private _userService = inject(UsersService)
  private registered = false;

  ngOnInit(): void {
      this.register = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.pattern(this._regexService.letters)]),
        lastName: new FormControl('', [Validators.required, Validators.pattern(this._regexService.letters)]),
        email: new FormControl('', [Validators.email, Validators.required, Validators.pattern(this._regexService.email)]),
        password: new FormControl('', [Validators.required, Validators.pattern(this._regexService.password)]),
        confirm: new FormControl('', Validators.required)
      })
  }

  confirmPassword(){
    return this.register?.get('password')?.value !== this.register?.get('confirm')?.value
  }
  
  registerUser(){
    this._userService.createUser(this.register.value).pipe(catchError(err => {
      console.log(err);
      return EMPTY;
    }))
    .subscribe(res => {
      console.log(res);
      this.registered = true;
    })
  }
}
