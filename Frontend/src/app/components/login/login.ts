import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegexValidator } from '../../services/regex-validator';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{

  login!: FormGroup;
  private _regexService = inject(RegexValidator)

  ngOnInit(): void {
      this.login = new FormGroup({
        email: new FormControl('', [Validators.email, Validators.required, Validators.pattern(this._regexService.email)]),
        password: new FormControl('', [Validators.required, Validators.pattern(this._regexService.password)]),
      })
  }

  singIn(){

  }
}
