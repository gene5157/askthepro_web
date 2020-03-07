import { Component, OnInit } from '@angular/core';
import { GetUserService } from '../get-user.service';

@Component({
  selector: 'app-aside-nav',
  templateUrl: './aside-nav.component.html',
  styleUrls: ['./aside-nav.component.css']
})
export class AsideNavComponent implements OnInit {
name:any;

  constructor(private userService: GetUserService) { 
    this.showUser()
    this.loadComponent()
    //console.log(this.showUser()['role'])
  }
  showUser(){
    var temp = this.userService.retriveUser().subscribe(result=>{
      var user={
        username: result[0].username,
        email: result[0].email,
        mobile: result[0].mobile,
        role: result[0].role,
        isActive: result[0].isActive
      }
      this.name = user.username
      return user
     // console.log(user)
      //return user
    })
  }
  loadComponent(){
    
  }
  ngOnInit() {
    
  }

}
