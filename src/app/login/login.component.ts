import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { GetUserService } from '../get-user.service';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { User } from 'user';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  email:String;
  password:String;
  registerUser:any = {
    username:"",
    email:"",
    password:"",
    password_confirm:""
  };
    reg_userdata:User;
    mySubscription:any;

  constructor(private authService: AuthService, private http: HttpClient, private router: Router, private userApi:GetUserService) {
    if(this.authService.isAuthenticated() == true){
      this.router.navigateByUrl('/home')
    }

    this.reg_userdata = new User();
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
   }

   register(){
     let t = this;
     if(t.registerUser.username == ""){
      t.registerUser.usernameInvalid = true
     }else{
      t.registerUser.usernameInvalid = false
     }

     if(t.registerUser.email == ""){
      t.registerUser.emailInvalid = true
     }else{
      t.registerUser.emailInvalid = false
     }

     if(t.registerUser.password == ""){
      t.registerUser.pwdInvalid = true
     }else{
      t.registerUser.pdwInvalid = false
      if(t.registerUser.password !== t.registerUser.password_confirm  ){
        t.registerUser.pwdMatchInvalid = true
       }else{
        t.registerUser.pwdMatchInvalid = false
       }
     }
    
     if(t.registerUser.usernameInvalid == false &&
       t.registerUser.emailInvalid == false &&
       t.registerUser.pdwInvalid == false &&
       t.registerUser.pwdMatchInvalid == false
       ){
        t.blockUI.start('Please wait, Registering your account...');
        this.userApi.hashService(t.registerUser.password).subscribe(result=>{
        console.log(result)
        t.reg_userdata.username = t.registerUser.username
        t.reg_userdata.email = t.registerUser.email
        //t.reg_userdata.password = t.registerUser.password
        t.reg_userdata.password = result["hashedPassword2"]
        t.reg_userdata.registered = true
        t.reg_userdata.isActive = true
        t.reg_userdata.role = "user"
        console.log(t.reg_userdata)
        t.userApi.isMatchFound(t.reg_userdata.email).subscribe(res => {
          console.log(res['length'])
          if(res['length'] != 0){
            t.blockUI.stop();
            Swal.fire("Error","This Email already registered! Please enter another email.","error")
          }else {
        this.userApi.registerUser(t.reg_userdata).subscribe((response) => {
          console.log(response)
          t.blockUI.stop();
          Swal.fire("Success","Account registered! Proceed to login.","success").then(()=>{
            this.router.navigateByUrl('/login')
          })
        });
      }
    }) 
      })
       }
     

   }

  login(){
    //login
    console.log(this.email)
    console.log(this.password)
    var emailCheck = this.email
    var pwdCheck = this.password
    if(emailCheck != undefined && pwdCheck != undefined){
      this.authService.userLogin(emailCheck,pwdCheck).subscribe(res => {
        // console.log(res)
        if(res['status'] == 200){
          localStorage.setItem('id_token',res["access_token"])
          // Swal.fire("Login Success","Welcome Back","info").then(()=>{
          //   this.router.navigate(['/home']);
          // })
          Swal.fire("Login Success","Welcome to askthepro.","success").then(()=>{
            this.router.navigateByUrl('/home')
            window.location.reload();
          })
        }
        },
        err => {
          console.log(err)
          Swal.fire("Error",err.error.message,"error");
          return err
          }
      )
    }
    // this.http.post("http://localhost:3002/auth/login",{
    //   "email":this.email,
    //   "password": this.password
    // }).subscribe(res => {
    //   localStorage.setItem('id_token',res["access_token"])
    //   this.router.navigate(['/home'])
    //   },
    //   err => console.log(err)
    // )
    //var test = this.userApi.loginVerified(emailCheck,passwordCheck).subscribe(result=>{
    //   if(result[0] !== undefined){
    //     this.generateToken()
    //     this.router.navigateByUrl('/home');
    //   }else{
    //   console.log('invalid credentials')
    // }
     // console.log(result)
   // })
    // if(emailCheck == "asd"){
    //   if(passwordCheck == "asd"){
    //     //login success
    //     this.router.navigateByUrl('/question');
    //   }else{
    //     console.log('invalid credentials')
    //   }
    //  }else{
    //   console.log('invalid credentials')
    // }


  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
