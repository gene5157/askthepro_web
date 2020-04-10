import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ApiDataService } from '../api-data.service';
import { AuthService } from '../auth.service';
import { GetUserService } from '../get-user.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostQuestionComponent } from '../post-question/post-question.component';
import { Answer } from '../question';
import swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css']
})
export class QuestionDetailComponent implements OnInit {
  @ViewChild(PostQuestionComponent) postQuestion;

  questionData: any = [];
  isLoaded: Boolean = true;
  question_id: any;
  userData: any;
  userID: any;
  bestAnswer: any;
  newAnswerList: any = [];
  postAnswer: Boolean = false;
  submitAnswer: any = {
    description: ""
  };
  isUserPost: boolean = false;
  mySubscription: any;
  isBestAnswer: Boolean = false;
  current_user: any;
  ansForm: FormGroup
  submitted = false;
  descInvalid: Boolean = false;
  userPoint: any;
  answerUserID: any;
  editAnswerID:any;
  editForm: FormGroup;
  descInvalid2: Boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private http: HttpClient, private activeRoute: ActivatedRoute, private queryService: ApiDataService, private auth: AuthService, private userService: GetUserService, private sanitizer: DomSanitizer) {
    this.activeRoute.params.subscribe(params => {
      this.question_id = params['question_id'];
      console.log(this.question_id)

    })
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
    this.getQuestion()
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
      title: ['', Validators.required]
    });
  }
  getQuestion() {
    let t = this;
    //this.http.get('/api/questions/'+ this.question_id).subscribe(result => {
    t.queryService.getQuesAns(this.question_id).subscribe(result => {
      console.log(result)
      t.questionData = result['question'][0]
      console.log(t.questionData)
      t.userID = t.questionData.user_id
      t.userData = t.questionData.answers.answers.answers
      console.log(t.userData)


      //t.getUser()
      // console.log(t.isBestAnswer)
      // console.log(t.bestAnswer)

      if (t.questionData.isAnswer == true) {
        var temp = t.questionData.answers.answers.answers.filter(ans => ans.isBestAnswered == true)
        t.bestAnswer = temp[0]
        console.log(t.bestAnswer)

      }
      //console.log(t.bestAnswer.length)
      if (t.bestAnswer != undefined) {
        t.isBestAnswer = true;
        for (var i = 0; i < t.questionData.answers.answers.length; i++) {
          if (t.questionData.answers.answers.answers[i].isBestAnswered != true) {
            t.newAnswerList.push(t.questionData.answers.answers.answers[i])
          }
        }
      } else {
        t.newAnswerList = t.questionData.answers.answers.answers
      }
      // this.userService.checkUser('id',this.userID).subscribe(res => {
      this.userService.retriveUser().subscribe(res => {
        this.current_user = res['user'].id
        this.getUserPoint()
        console.log(res)

        if (this.current_user == this.userID) {
          this.isUserPost = true;
        }
      })

      // t.newAnswerList.forEach(ans => {
      //   if(ans.isBestAnswered == true){
      //     t.newAnswerList.splice(ans,1)
      //   }
      // });
      console.log(t.newAnswerList)

      t.isLoaded = true;
    })
  }
  editAns(data) {
    console.log(data);
    ($("#editAns") as any).modal("show");
    ($(".summernote") as any).summernote("code", data.description);
    this.editAnswerID = data.id
    this.editForm.patchValue({
      title: data.title
    })
  }

  change(e) {
    if (this.auth.isAuthenticated() == true) {
      this.postAnswer = true
      this.loadComponent()
    } else {
      Swal.fire("Warning", "You has to either login or register first before post an answer!", "warning")
    }

  }
  loadComponent() {
    //$(".summernote").summernote()
    $(document).ready(() => {
      ($(".summernote") as any).summernote({ height: 150, width: "100%" });
    })
    this.ansForm = this.formBuilder.group({
      ansTitle: ['', Validators.required]
    });
  }

  // getUser() {
  //   this.http.get('/api/user/' + this.userID).subscribe(result => {
  //     this.userData = result
  //     //console.log(this.userData)
  //     //console.log(this.userData)
  //   })
  // }

  get f() {
    return this.ansForm.controls
  }
  get e() {
    return this.editForm.controls
  }

  send(values) {
    this.userService.retriveUser().subscribe(user => {
      console.log(values)
      let date = new Date()
      let Description = ($("#Description") as any).summernote('code');
      var res = Description.replace(/"/g, '\\"').replace(/\n/g, '');
      var check = this.countText(res)
      console.log(check)
      this.submitted = true;
      // stop here if form is invalid
      if (check == false) {
        this.descInvalid = true
      } else {
        this.descInvalid = false
      }
      if (this.ansForm.invalid) {
        return;
      }
      else if (values.title != "" && check != false) {
        var answer = {
          title: values.ansTitle,
          date_post: date,
          userId: this.current_user,
          questionId: parseInt(this.question_id),
          description: res,
          isBestAnswered: 0
        }
        console.log(answer)
        this.queryService.createAns('createAnswer', answer).subscribe(res => {
          console.log(res)
          if (res != undefined) {
            Swal.fire("Success", "Your had submit a answer.", "success").then(() => {
              this.rewardPoint()
              this.router.navigateByUrl('/question/' + this.question_id);
            })

            //this.newAnswerList.push(res)

          }
        })
      }
    })
  }

  rewardPoint() {
    console.log(this.userPoint)
    if (this.userPoint.length != 0) {
      this.userPoint['totalPoint'] = parseInt(this.userPoint['totalPoint']) + 1
      this.queryService.updPoint(this.userPoint).subscribe()
    } else {
      var newUserPoint = {
        userId: this.current_user,
        totalPoint: 1
      }
      this.queryService.createPoint(newUserPoint).subscribe()
    }
  }
  getUserPoint() {
    this.queryService.getPoint(this.current_user).subscribe(res => {
      this.userPoint = JSON.parse(JSON.stringify(res['point']))
      console.log(this.userPoint)
    })
  }

  getInnerHtml(html) {
    console.log(html)
    //this.validateForm.controls['content'].setValue(html);
    //var viewContent = this.sanitizer.bypassSecurityTrustHtml (html);
    return document.getElementById("answer").innerHTML = html;
  }

  selectedBA(value) {
    console.log(value)
    //check best ans exist or not
    // var newAnswer = {
    //   isBestAnswered: 1,
    //   id: value.id
    // }
    // var updOldAns = {
    //   isBestAnswered: 0,
    //   id: this.bestAnswer.id
    // }

    var newBestAnswer = {
      isBestAnswered: 1,
      id: value.id
    }
    if (this.bestAnswer != undefined) {
      // console.log(newAnswer)
      Swal.fire({
        title: 'Are you sure?',
        text: "Select this as BEST ANSWER and Current BEST ANSWER will be replaced!",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          var oldBestAnswer = {
            isBestAnswered: 0,
            id: this.bestAnswer.id
          }
          this.queryService.updBestAns(oldBestAnswer).subscribe(res => {
            console.log(res)
            this.queryService.updBestAns(newBestAnswer).subscribe(res2 => {
              console.log(res2)
              Swal.fire(
                'Success!',
                'Best Answer has been updated.',
                'success'
              ).then(() => {
                this.router.navigateByUrl('/question/' + this.question_id);
              })
            })
          })
        }
      })

    } else {
      var first_upd_newBestAnswer = {
        isBestAnswered: 1,
        id: value.id,
        ques_id: this.question_id,
        isAnswer: 1
      }
      this.queryService.updBestAns(first_upd_newBestAnswer).subscribe(res2 => {
        console.log(res2)
        Swal.fire(
          'Success!',
          'Best Answer has been updated.',
          'success'
        ).then(() => {
          this.router.navigateByUrl('/question/' + this.question_id);
        })
      })
    }

  }

  updAns(values) {
    let t = this;
    let Description = ($("#description_edt") as any).summernote('code');
    var res = Description.replace(/\n/g, '');
    //var res = Description.replace(/"/g, '\\"').replace(/\n/g, '');
    var temp = this.countText(res)
    console.log(Description)
    console.log(values)
    if (temp == false) {
      t.descInvalid = true
    } else {
      t.descInvalid = false
    }
    this.submitted = true;
    // stop here if form is invalid
    if (this.editForm.invalid) {
      return;
    }
    if (temp != false) {
      const data = this.editForm.value as Answer;
      var answer={
        id:"",
        title:"",
        description:""
      } ;
      answer.id = this.editAnswerID
      answer.title = values.title;
      answer.description = res;
      console.log(answer)
      t.queryService.updAns(answer).subscribe(res => {
        console.log(res)
        if (res) {
          ($("#editAns") as any).modal("hide");
          swal.fire('Success', 'Answer has update!', 'success').then(() => {
            this.router.navigateByUrl('/question/' + this.question_id);
          })
        }
      })
    }
  }

  convertTime(value: any) {
    let d = new Date(moment(value).format('DD/MMM/YYYY'));
    // console.log(d)
    var day = ("0" + d.getDate()).slice(-2);
    var month = ("0" + (d.getMonth() + 1)).slice(-2);
    var year = d.getFullYear();
    // var hour = ("0" + d.getHours()).slice(-2);
    // var minute = ("0" + d.getMinutes()).slice(-2);
    var date2 = day + "/" + month + "/" + year;
    return date2;
  }

  // public dateFormat(value: any) {
  //   let d = new Date(value * 1000);
  //   var day = ("0" + d.getUTCDate()).slice(-2);
  //   var month = ("0" + (d.getUTCMonth() + 1)).slice(-2);
  //   var year = d.getUTCFullYear();
  //   // var hour = ("0" + d.getHours()).slice(-2);
  //   // var minute = ("0" + d.getMinutes()).slice(-2);
  //   var date = month + "/" + day + "/" + year;
  //   return date;
  // }

  convertDate(value: any) {
    var date;
    if (value.toString().length > 10) {
      date = moment.unix(value / 1000).format('MMM DD' + ", " + 'YYYY');
    } else {
      date = moment.unix(value).format('MMM DD' + ", " + 'YYYY');
    }
    return date;
  }

  countDate(value: any) {
    return moment(value).fromNow()

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

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}
