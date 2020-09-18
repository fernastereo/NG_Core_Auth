import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private acct: AccountService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  //Properties
  insertForm: FormGroup;
  userName: FormControl;
  password: FormControl;
  cPassword: FormControl;
  email: FormControl;
}
