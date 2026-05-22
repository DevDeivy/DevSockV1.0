import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { DevsockLogo } from '../devsock-logo/devsock-logo';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DevsockLogo],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
