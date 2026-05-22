import { Routes } from "@angular/router";
import { Login } from "./login/login";
import { Register } from "./register/register";
import { SendEmail } from "./send-email/send-email";
import { Home } from "./home/home";

export const rout: Routes = [
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'sendEmail', component: SendEmail },
  { path: 'home', component: Home },
  { path: '**', redirectTo: 'home' }
];