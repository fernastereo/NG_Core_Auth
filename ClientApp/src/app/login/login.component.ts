import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  insertForm: FormGroup;
  userName: FormControl;
  password: FormControl;
  returnUrl: string;
  errorMessage: string;
  invalidLogin: boolean;

  constructor(private acct: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  )
  { }

  onSubmit() {
    let userLogin = this.insertForm.value;

    this.acct.login(userLogin.userName, userLogin.password).subscribe(result => {
      let token = (<any>result).token;
      console.log(token);
      console.log(result.userRole);
      console.log('User logged in successfully');
      console.log(this.returnUrl);
      this.invalidLogin = false;
      this.router.navigateByUrl(this.returnUrl);
    },
    error => {
      this.invalidLogin = true;
      this.errorMessage = "Invalid details supplied - Could not log in"
      console.log(this.errorMessage);
    }
    )

  }


  ngOnInit() {
    this.userName = new FormControl('', [Validators.required]);
    this.password = new FormControl('', [Validators.required]);

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';

    this.insertForm = this.fb.group({
      "userName": this.userName,
      "password": this.password
    });
  }

}
