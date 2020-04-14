import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GetUserService } from '../get-user.service';
import { User } from 'user';
import { AuthService } from '../auth.service';
import { ApiDataService } from '../api-data.service';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PostQuestionComponent } from '../post-question/post-question.component';
import { Question } from '../question';
import swal from 'sweetalert2';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  @Input() data: any;
  @ViewChild(PostQuestionComponent)
  private postQues: PostQuestionComponent;

  users: User[];
  user: User;
  user_id: any;
  ques_id:any;
  questionData: any;
  questionTable: any;
  editForm: FormGroup;
  ques_description: any;
  categories: any;
  submitted = false;
  ques: Question;
  edtQues:any={
    title:"",
    date_post:null,
    summary:"",
    categories_id:"",
    user_id:"",
    description:null,
    isAnswered:null,
    id:""
  };
  current_date: any;
  valid: any = {
    descInvalid2: false,
    categoryInvalid2: false
  };
  isAdd: boolean = false;
  mySubscription:any;
  totalPoints:any;

  constructor(private router:Router, private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private userService: GetUserService, private queryService: ApiDataService) {
    this.current_date = this.dateFormat()
    console.log(this.current_date)
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


  ngOnInit() {
    this.showUser()
    this.loadCategory()
    
    // $(document).ready(function () {
    //   $('#dtBasicExample').DataTable();
    //   $('.dataTables_length').addClass('bs-select');
    //   });
    $(document).ready(() => {
      ($(".summernote") as any).summernote({
        height: 150,
        width: "100%",
        popover: {
          image: [],
          link: [],
          air: []
        }
      });
    })
    this.editForm = this.formBuilder.group({
      title: ['', Validators.required],
      date_post: [{ value: this.current_date, disabled: true }],
      summary: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    
  }
  showUser() {
    this.userService.retriveUser().subscribe(result => {
      var user;
      user = {
        username: result['user'].username,
        email: result['user'].email,
        mobile: result['user'].mobile,
        type: result['user'].type,
        isActive: result['user'].isActive
      }
      this.user_id = result['user'].id
      this.getPostedQuestion(this.user_id)
      if (result['user'].role == 'admin') {
        this.getAllQues()
      }
      return user
    })
  }
  getAllQues() {
    this.queryService.getAllQuest().subscribe(result => {
      this.questionData = result['questions']
     
    })
  }
  getPostedQuestion(user_id) {
    this.queryService.getQuesCategory(user_id).subscribe(result => {
      console.log(result)
      this.questionData = result['questions']
      this.getPoint()
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
  showModal() {
    ($("#editQues") as any).modal("show");
    ($(".summernote") as any).summernote("code", '');
    this.editForm.patchValue({
      title: '',
      date_post: this.current_date,
      summary: '',
      category: ''
    })
    this.isAdd = true;
  }
  editModal(question) {
    this.isAdd = false;
    ($("#editQues") as any).modal("show");
    ($(".summernote") as any).summernote("code", question.description);
    console.log(question)
    this.ques_id = question.id
    this.editForm.patchValue({
      title: question.title,
      date_post: question.date_post,
      summary: question.summary,
      category: question.categories_id
    })

    // this.title.setValue(question.title)
    // this.date_post.setValue(question.date_post)
    // this.summary.setValue(question.summary)
    // this.category.setValue(question.category)
  }

  get f() {
    return this.editForm.controls
  }
  loadCategory() {
    this.queryService.getCategory().subscribe(result => {
      this.categories = result['categorys']
      console.log(this.categories)
    })
  }
  getPoint(){
    this.queryService.getPoint(this.user_id).subscribe(res => {
      this.totalPoints = res['point'].totalPoint
      console.log(this.totalPoints)
    })
  }
  updQues(values) {
    let t = this;
    let Description = ($("#description_edt") as any).summernote('code');
    var res = Description.replace(/\n/g, '');
    //var res = Description.replace(/"/g, '\\"').replace(/\n/g, '');
    var temp = this.countText(res)
    console.log(Description)

    // if(t.post.title == null){
    //   t.valid.titleInvalid = true
    // }else{
    //   t.valid.titleInvalid = false
    // }
    // if(t.post.summary == null){
    //   t.valid.summaryInvalid = true
    // }else{
    //   t.valid.summaryInvalid = false
    // }
    console.log(res)
    if (values.category == "") {
      t.valid.categoryInvalid = true
    } else {
      t.valid.categoryInvalid = false
    }
    if (temp == false) {
      t.valid.descInvalid = true
    } else {
      t.valid.descInvalid = false
    }
    this.submitted = true;
    // stop here if form is invalid
    if (this.editForm.invalid) {
      return;
    }
    if (values.title != "" && values.summary != "" && values.category != "" &&
      temp != false) {
      const data = this.editForm.value as Question;
      console.log(data)
      console.log(t.isAdd)
      var today = Date.now()
      t.userService.retriveUser().subscribe(result => {
        t.user_id = result['user'].id
      })
      console.log(values.title)
      
      // t.edtQues.title = data.title;
      // t.edtQues.summary = values.summary;
      // t.edtQues.description = res;
      // t.edtQues.categories_id = values.category;

      if (t.isAdd == true) {
        //add question
        t.edtQues.title = values.title;
        // t.edtQues.date_post = '';
        t.edtQues.user_id = t.user_id;
        t.edtQues.summary = values.summary;
        t.edtQues.description = res;
        t.edtQues.categories_id = values.category;
        t.edtQues.isAnswered = null;
          console.log(t.ques)
          t.queryService.createQuestion('createQuestion', t.edtQues).subscribe(res => {
            console.log(res)
            if (res) {
              ($("#editQues") as any).modal("hide");
              swal.fire('Success', 'Question has posted!', 'success').then(() => {
                t.router.navigate(['/dashboard'])

              })
            }
          })
       
      } else {
        //upd question
        console.log(data)
        t.edtQues.title = values.title;
        t.edtQues.summary = values.summary;
        t.edtQues.description = res;
        t.edtQues.categories_id = values.category;
        t.edtQues.id = this.ques_id;
        console.log(t.edtQues)
        t.queryService.updQuestion(t.edtQues).subscribe(res => {
          console.log(res)
          if (res) {
            ($("#editQues") as any).modal("hide");
            swal.fire('Success', 'Question has updated!', 'success').then(() => {
              t.router.navigate(['/dashboard'])

            })
          }
        })
      }
    }
  }
  delQuest(id){
    var ques_id={
      id:""
    };
    ques_id.id = id;
    if(id != undefined){
      swal.fire({
        title: 'Are you sure to delete this question?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          //del ques
          this.queryService.getQuesAns(id).subscribe(result => {
            console.log(result['question'][0].answers.answers.answers)
            if(result['question'][0].answers.answers.answers.length == 0){
              this.queryService.delQuestion(ques_id).subscribe(res => {
                console.log(res);
                ($("#editQues") as any).modal("hide");
              swal.fire(
                'Deleted!',
                'Your Question has been deleted.',
                'success'
              )
              this.router.navigate(['/dashboard'])
              })
            }else{
              swal.fire("Sorry","This question is not able to delete as it got answer. Please contact admin.","warning")
            }
          })
          
          
        }
      })      
    }
  }
  countText(description: String) {
    var str = $("<span>" + description + "</span>").text();
    if (str != '') {
      if (str.length >= 1) {
        return true
      } else {
        return false
      }
    } else { return false }
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
