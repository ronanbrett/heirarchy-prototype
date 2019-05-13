import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../auth/login.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ffma-user-selector',
  templateUrl: './user-selector.component.html',
  styleUrls: ['./user-selector.component.scss']
})
export class UserSelectorComponent implements OnInit {
  userControl: FormControl = new FormControl();

  constructor(public loginService: LoginService) {}

  ngOnInit() {
    this.userControl.valueChanges.subscribe(n => {
      this.loginService.login(n);
    });
  }
}
