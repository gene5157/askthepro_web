import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ApiDataService } from '../api-data.service';
import { AuthService } from '../auth.service';
import { GetUserService } from '../get-user.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css']
})
export class QuestionDetailComponent implements OnInit {

  questionData: any = [];
  isLoaded: Boolean = true;
  question_id: any;
  userData: any;
  userID: any;
  bestAnswer: any = [];
  newAnswerList: any = [];
  postAnswer: Boolean = false;
  submitAnswer: any = {
    description: ""
  };
  isUserPost: boolean = false;
  mySubscription:any;

  constructor(private router: Router, private http: HttpClient, private activeRoute: ActivatedRoute, private queryService: ApiDataService, private auth: AuthService, private userService: GetUserService, private sanitizer: DomSanitizer) {
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
  }

  getQuestion() {
    let t = this;
    //this.http.get('/api/questions/'+ this.question_id).subscribe(result => {
    t.queryService.getQuestions(this.question_id).subscribe(result => {
      t.questionData = result
      console.log(t.questionData)
      t.userID = t.questionData.user_id
      t.getUser()


      if (t.questionData.isAnswer == true) {
        var temp = t.questionData.answers.filter(ans => ans.isBestAnswered == true)
        t.bestAnswer = temp[0]
        console.log(t.bestAnswer)
      }
      console.log(t.bestAnswer.length)
      if (t.bestAnswer != undefined) {
        for (var i = 0; i < t.questionData.answers.length; i++) {
          if (t.questionData.answers[i].isBestAnswered != true) {
            t.newAnswerList.push(t.questionData.answers[i])
          }
        }
        this.userService.retriveUser().subscribe(res => {
          var current_user = res[0].id
          console.log(res)

          if (current_user == this.questionData.user_id) {
            this.isUserPost = true;
          }
        })
        // t.newAnswerList.forEach(ans => {
        //   if(ans.isBestAnswered == true){
        //     t.newAnswerList.splice(ans,1)
        //   }
        // });
        console.log(t.newAnswerList)
      }
      t.isLoaded = true;
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
  }

  getUser() {
    this.http.get('/api/user/' + this.userID).subscribe(result => {
      this.userData = result
      //console.log(this.userData)
      //console.log(this.userData)
    })
  }

  send() {
    this.userService.retriveUser().subscribe(user => {
      console.log(user)
      let date = new Date()
      let Description = ($("#Description") as any).summernote('code');
      var res = Description.replace(/"/g, '\\"').replace(/\n/g, '');
      console.log(res)
      if (res != undefined) {
        var answer = {
          title: this.submitAnswer.title,
          date_post: date,
          userId: user[0].id,
          questionId: parseInt(this.question_id),
          user: {
            username: user[0].username,
            email: user[0].email
          },
          description: res,
          isBestAnswered: null
        }
        console.log(answer)
        this.queryService.createAnswer(answer).subscribe(res => {
          console.log(res)
          if (res != undefined) {
            Swal.fire("Success", "Your had submit a answer.", "success").then(()=>{
              this.router.navigateByUrl('/question/' + this.question_id);
            })
            
            //this.newAnswerList.push(res)

          }
        })
      }
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
    var newAnswer = {
      isBestAnswered: true
    }
    var updOldAns = {
      isBestAnswered: false
    }
    if (this.bestAnswer != undefined) {
      console.log(newAnswer)
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
          this.queryService.updateAnsQuery(this.bestAnswer.id, updOldAns).subscribe(res => {
          console.log(res)
            this.queryService.updateAnsQuery(value.id, newAnswer).subscribe(res2 => {
              console.log(res2)
              Swal.fire(
                'Success!',
                'Best Answer has been updated.',
                'success'
              ).then(()=>{
                this.router.navigateByUrl('/question/' + this.question_id);
              })
            })
          })
        }
      })

    }

  }

  convertTime(value: any) {
    let d = new Date(moment(value).utc().format('DD/MMM/YYYY'));
    var day = ("0" + d.getUTCDate()).slice(-2);
    var month = ("0" + (d.getUTCMonth() + 1)).slice(-2);
    var year = d.getUTCFullYear();
    // var hour = ("0" + d.getHours()).slice(-2);
    // var minute = ("0" + d.getMinutes()).slice(-2);
    var date2 = day + "/" + month + "/" + year;
    return date2;
  }

  public dateFormat(value: any) {
    let d = new Date(value * 1000);
    var day = ("0" + d.getUTCDate()).slice(-2);
    var month = ("0" + (d.getUTCMonth() + 1)).slice(-2);
    var year = d.getUTCFullYear();
    // var hour = ("0" + d.getHours()).slice(-2);
    // var minute = ("0" + d.getMinutes()).slice(-2);
    var date = month + "/" + day + "/" + year;
    return date;
  }

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

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}
