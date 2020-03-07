import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';
import { GetUserService } from './get-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'askthepro';
  isLogin:boolean=false;
  user_role:any;

  constructor(private userService: GetUserService, public auth:AuthService){
    // var token = this.cookieService.get("token_id")
    // if(token !== ''){
    //   this.isLogin = true;
    // console.log(this.cookieService.get("token_id"))
    // }
    if(auth.isAuthenticated()){
    userService.retriveUser().subscribe(user => {
      this.user_role = user[0].role
      console.log(this.user_role)
    })
  }
    console.log(auth.isAuthenticated())
    this.loadComponent();
  }
  ngOnInit(){
    
  }
  loadComponent(){
    $(document).ready(function(){
      $('#navbarDropdownMenuLink-4').on("click", function(e){
        //console.log(e)
        $('.dropdown-menu').css({'opacity':1})
        //e.stopPropagation();
        //e.preventDefault();
      });
    });
  }
  logOut(){
    this.auth.logoutUser();
  }
}
