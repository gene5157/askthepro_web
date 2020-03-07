import { Component, OnInit, Input } from '@angular/core';
import { GetUserService } from '../get-user.service';
import { User } from 'user';
import { AuthService } from '../auth.service';
import { ApiDataService } from '../api-data.service';
import * as moment from 'moment'; 
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
@Input() data: any;
users: User[];
user:User;
user_id:any; 
questionData:any;
questionTable:any;
  constructor(private sanitizer: DomSanitizer ,private userService: GetUserService, private queryService: ApiDataService) { }


  ngOnInit() {
    this.showUser()
    // $(document).ready(function () {
    //   $('#dtBasicExample').DataTable();
    //   $('.dataTables_length').addClass('bs-select');
    //   });
  }
  
  ngAfterViewInit(){
    
  }
  showUser(){
    this.userService.retriveUser().subscribe(result=>{
      var user;
      user={
        username: result[0].username,
        email: result[0].email,
        mobile: result[0].mobile,
        type: result[0].type,
        isActive: result[0].isActive
      }
      this.user_id = result[0].id
      this.getPostedQuestion(this.user_id)
      if(result[0].role == 'admin'){
        this.getAllQues()
      }
      return user
    })
  }
  getAllQues(){
    this.queryService.getAllQuestions().subscribe(result => {
      this.questionData = result
    })
  }
  getPostedQuestion(user_id){
    this.queryService.searchQuestions('user_id',user_id).subscribe(result=>{
      console.log(result)
      this.questionData = result
    })
  }
  countDate(value: any) {
    return moment(value).fromNow()
  }
  // getUsers2(): void {
  //   this.userService.getUsers()
  //     .subscribe(users => this.users = users);
  //     console.log(this.users)
  // }
  

}
