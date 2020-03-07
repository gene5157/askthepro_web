import { Component, OnInit } from '@angular/core';
import { ApiDataService } from '../api-data.service';
import { Question } from '../question';
import { GetUserService } from '../get-user.service';
import swal from 'sweetalert2'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-question',
  templateUrl: './post-question.component.html',
  styleUrls: ['./post-question.component.css']
})
export class PostQuestionComponent implements OnInit {
  // post:any={
  //   title: String,
  //   date: Date,
  //   summary: String,
  //   categories: String,
  //   description: String,
  //   user_id: String,
  //   categories_id: String,
  //   isAnswered: Boolean

  // };
  post: Question;
  current_date:any;
  categories:any=[];
  tags:any=[];
  valid:any={
    titleInvalid:false,
    summaryInvalid:false,
    descInvalid:false,
    categoryInvalid:false
  };
  user_id:any;

  constructor(private router:Router, private queryService: ApiDataService, private userService: GetUserService) {
    
    this.post = new Question();
    this.current_date = this.dateFormat()
    console.log(this.current_date)
   }

  ngOnInit() {
    this.loadCategory()
    this.loadTag()
    this.loadComponent()
  }

  loadCategory(){
    this.queryService.getCategory().subscribe(result=>{
      this.categories = result
      console.log(this.categories)
    })
  }
  loadTag(){
    this.queryService.getTag().subscribe(result=>{
      this.tags = result
      console.log(this.tags)
    })
  }

  shortDesc(description: String) {
    var str = $("<span>" + description + "</span>").text();
    if (str != '') {
      if (str.length > 80) {
        return str.substring(0, 50) + ' ...'
      } else {
        return str
      }
    } else {
      return description
    }
  }
  loadComponent() {
    //$(".summernote").summernote()
    $(document).ready(() => {
      ($(".summernote") as any).summernote({ height: 150, width: "100%" });
    })
  }

  postQuestion(){
    let t = this;
    let Description = ($("#description") as any).summernote('code');
    var res = Description.replace(/"/g, '\\"').replace(/\n/g, '');
    var temp = this.countText(res)
    console.log(temp)
    console.log(t.post.title)
    if(t.post.title == null){
      t.valid.titleInvalid = true
    }else{
      t.valid.titleInvalid = false
    }
    if(t.post.summary == null){
      t.valid.summaryInvalid = true
    }else{
      t.valid.summaryInvalid = false
    }
    if(t.post.category == null || t.post.category == ""){
      t.valid.categoryInvalid = true
    }else{
      t.valid.categoryInvalid = false
    }
    if(temp == false){
      t.valid.descInvalid = true
    }else{
      t.valid.descInvalid = false
    }
    if(t.post.title != "" && t.post.summary != "" && t.post.category != "" &&
     temp != false){
       if(t.post.categories_id == "1"){
         t.post.category = "Web Programming"
       }else if(t.post.categories_id == "2"){
        t.post.category = "Web Database"
      }else if(t.post.categories_id == "3"){
        t.post.category = "Angular Web"
      }else if(t.post.categories_id == "4"){
        t.post.category = "Database Programming"
      }
       t.userService.retriveUser().subscribe(result=>{
         console.log(result)
          var today = new Date()
          t.user_id = result[0].id
          t.post.description = res
          t.post.user_id = t.user_id
          t.post.date_post = JSON.parse(JSON.stringify(today))
          t.post.isAnswered = null
          console.log(t.post)
         t.queryService.createQuestions(t.post).subscribe(res =>{
           console.log(res)
           if(res){
             swal.fire('Success','Question has already posted','success').then(()=>{
             // t.router.navigate(['/dashboard'])
             })
           }
         })

       })



    }

  }
  countText(description: String){
    var str = $("<span>" + description + "</span>").text();
    if (str != '') {
      if (str.length >= 1) {
        return true
      } else {
        return false
      }
    }else{return false}
  }
  shortenText(description: String) {

    var str = $("<span>" + description + "</span>").text();
    // console.log(str)
    if (str != '') {
      if (str.length > 21) {
        return str.substring(0, 21) + ' ...'
      } else {
        return str
      }
    } else {
      return description
    }
  }
  
  public dateFormat() {
    let d = new Date();
    var day = ("0" + d.getUTCDate()).slice(-2);
    var month = ("0" + (d.getUTCMonth() + 1)).slice(-2);
    var year = d.getUTCFullYear();
    // var hour = ("0" + d.getHours()).slice(-2);
    // var minute = ("0" + d.getMinutes()).slice(-2);
    var date = month + "/" + day + "/" + year;
    return date;
  }
}
