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
    //console.log(this.showUser()['role'])
  }
  showUser(){
    var temp = this.userService.retriveUser().subscribe(result=>{
      var user={
        username: result['user'].username,
        email: result['user'].email,
        mobile: result['user'].mobile,
        role: result['user'].role,
        isActive: result['user'].isActive
      }
      this.name = user.username
      return user
     // console.log(user)
      //return user
    })
  }
  ngOnInit() {
    
  }

}
