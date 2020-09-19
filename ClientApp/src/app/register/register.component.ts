import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
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


  //Properties
  insertForm: FormGroup;
  userName: FormControl;
  password: FormControl;
  cPassword: FormControl;
  email: FormControl;

  //Custom validator
  mustMatch(passwordControl: AbstractControl): ValidatorFn {
    return (cPasswordControl: AbstractControl): { [key: string]: boolean } | null =>
    {
      //return null if constrols haven't initialized yet
      if (!passwordControl && !cPasswordControl) {
        return null;
      }
      //return null if another validator has already found an error on the matchingControl
      if (cPasswordControl.hasError && !passwordControl.hasError) {
        return null;
      }
      //set error on matchingControl if validation fails
      if (passwordControl.value !== cPasswordControl.value) {
        return { 'mustMatch': true };
      } else {
        return null;
      }
    };
  }

  ngOnInit() {
    this.userName = new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(5)]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.cPassword = new FormControl('', [Validators.required, this.mustMatch(this.password)]);
    this.email = new FormControl('', [Validators.required]);
  }
}
