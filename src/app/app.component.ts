import { Component } from '@angular/core';
import { LoginService } from './core/auth/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(private loginService: LoginService){
    this.loginService.login('Carolyn Legge');
  }
  title = 'policy-tree-proto';
}

