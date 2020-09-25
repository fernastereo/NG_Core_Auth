import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private acct: AccountService,
    private router: Router,
    private modalService: BsModalService
  ) { }


  //Properties
  insertForm: FormGroup;
  userName: FormControl;
  password: FormControl;
  cPassword: FormControl;
  email: FormControl;
  modalRef: BsModalRef;
  invalidRegister: boolean;
  errorList: string[];

  @ViewChild('template', { static: true }) modal: TemplateRef<any>;

  onSubmit() {
    let userDetails = this.insertForm.value;
    this.acct.register(userDetails.userName, userDetails.password, userDetails.email).subscribe(result =>
    {
      this.invalidRegister = true;
      this.router.navigate(['/loginpage']);
    }, error =>
    {
      this.invalidRegister = false;
      console.error(error);
    });

    this.modalRef = this.modalService.show(this.modal);
  }

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
    this.userName = new FormControl('', [Validators.required, Validators.maxLength(25), Validators.minLength(6)]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.cPassword = new FormControl('', [Validators.required, this.mustMatch(this.password)]);
    this.email = new FormControl('', [Validators.required]);
    this.errorList = [];

    this.insertForm = this.fb.group({
      'userName': this.userName,
      'password': this.password,
      'cPassword': this.cPassword,
      'email': this.email
    })
  }
}
