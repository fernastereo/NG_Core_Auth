import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  //Need http client to comunicate over HTTP with web api
  constructor(private http: HttpClient, private router: Router) { }

  //Url to access to our web api
  private baseUrlLogin: string = "/api/account/login";
  private baseUrlRegister: string = "/api/account/register";

  //User related properties
  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private userName = new BehaviorSubject<string>(localStorage.getItem('username'));
  private userRole = new BehaviorSubject<string>(localStorage.getItem('userrole'));

  //Register Method
  register(userName: string, password: string, email: string) {
    return this.http.post<any>(this.baseUrlRegister, { userName, password, email }).pipe(
      map(result => {
        //registration was successful
        return result;
      }, error => {
          return error;
      })
    );
  }

  //login method
  login(userName: string, password: string) {

    //pipe lets combine multiple functions into a single function
    //pipe runs the composed functions in sequence
    return this.http.post<any>(this.baseUrlLogin, { userName, password }).pipe(
      map(result => {
        //if login is successful and if there is a jwt token in the response
        if (result && result.token) {
          //store user's details and jwt token in local storage to keep user logged in between page refreshes
          this.loginStatus.next(true);
          localStorage.setItem('loginStatus', '1');
          localStorage.setItem('jwt', result.token);
          localStorage.setItem('userName', result.userName);
          localStorage.setItem('userRole', result.userRole);
          localStorage.setItem('expiration', result.expiration);

        }

        return result;
      })
    );
  }

  logout() {
    //set loginStatus to false and delete saved jwt cookie
    this.loginStatus.next(false);
    localStorage.removeItem('jwt');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('expiration');
    localStorage.setItem('loginStatus', '0');

    this.router.navigate(['/login']);
    console.log('User logged out succesfully');
  }

  checkLoginStatus() : boolean{
    return false;
  }

  get isLoggedIn() {
    return this.loginStatus.asObservable();
  }

  get currentUserName() {
    return this.userName.asObservable();
  }

  get currentUserRole() {
    return this.userRole.asObservable();
  }
}
