import { Component, HostBinding } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';
import { GetUserService } from './get-user.service';
import {trigger,state,style,animate,transition} from '@angular/animations';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
    // animation triggers go here
  ]
})
export class AppComponent {
  title = 'askthepro';
  isLogin:boolean=false;
  user_role:any;
  @HostBinding('@.disabled')
  public animationsDisabled = false;

  constructor(private userService: GetUserService, public auth:AuthService){
    // var token = this.cookieService.get("token_id")
    // if(token !== ''){
    //   this.isLogin = true;
    // console.log(this.cookieService.get("token_id"))
    // }
    if(auth.isAuthenticated()){
    userService.retriveUser().subscribe(res => {
      this.user_role = res['user'].role
      console.log(this.user_role)
    })
    this.animationsDisabled = false;
  }
    console.log(auth.isAuthenticated())
    this.loadComponent();
  }
  ngOnInit(){ 
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  toggleAnimations() {
    this.animationsDisabled = !this.animationsDisabled;
  }

  loadComponent(){
    // $(document).ready(function(){
    //   $('#navbarDropdownMenuLink-4').on("click", function(e){
    //     //console.log(e)
    //     $('.dropdown-menu').css({'opacity':1})
    //     //e.stopPropagation();
    //     //e.preventDefault();
    //   });
    // });
  }
  logOut(){
    this.auth.logoutUser();
  }
}
