import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { User } from 'user';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})


export class GetUserService {
  //USERS: User[];
  // USERS: any;
  // questions: Observable<any> = this.http.get('/api/questions');
  // API path
  //base_path = 'http://localhost:3000/';

  // getUsers(): Observable<User[]> {
  //   this.USERS = this.http.get('/api/users');
  //   console.log(this.USERS)
  //   return of(this.USERS);

  // }



  constructor(private http: HttpClient, private authService: AuthService) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
  subUser(username: string, password: string) {
    // this.getList().subscribe(res => {
    //   var tempUser;
    //   tempUser = res
    //   var realUser = tempUser.filter(user=>
    //     user.username == username && user.password == password
    //     )
    //     return realUser
    // })
  }

  hashService(value) {
    return this.http.post('http://localhost:3002/pass-hash',
      { "password": value })
  }

  public isMatchFound(email) {
    return this.http
      .get<User>('api/user/?email_like=' + email)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }


  registerUser(item): Observable<User> {
    console.log(item)
    return this.http
      .post<User>('api/user', JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  // showUsername(){
  //    this.retriveUser().subscribe(result=>{
  //     var user;
  //     user={
  //       username: result[0].username,
  //       email: result[0].email,
  //       mobile: result[0].mobile,
  //       type: result[0].type,
  //       isActive: result[0].isActive
  //     }
  //      console.log(result)
  //     // console.log(user)
  //     return JSON.parse(JSON.stringify(result))
  //   })
  // }

  retriveUser() {
    var email = this.authService.getUserInfoFromToken()
    return this.http
      .get<User>('api/user?email=' + email)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )

  }

  // login check
  loginVerified(email, password): Observable<User> {
    return this.http
      .get<User>('api/user?email=' + email + '&password=' + password)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

}
