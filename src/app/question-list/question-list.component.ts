import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ApiDataService } from '../api-data.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit {

  subLoadData: any;
  data: any = [];
  questionData: any = [];
  category_id: any;
  category_type: any;
  filter: Boolean = false;
  filterType: any = {
    recent: false,
    noAns: false
  };
  noFound:boolean=false;
  filterData: any = [];
  tempData: any = [];
  constructor(private sanitizer: DomSanitizer, private http: HttpClient, private activeRoute: ActivatedRoute, private queryService: ApiDataService) {
    this.subLoadData = this.activeRoute.params.subscribe(params => {
      this.category_id = params['category_id'];
      this.category_type = params['category_type'];
      console.log(this.category_id)



    })
  }

  ngOnInit() {
    this.getCategory()
  }

  applyFilter() {
    console.log(this.filterType)
    if (this.filterType.recent == true && this.filterType.noAns == false) {
      this.loadDataWithFilter("recent")
    } else if (this.filterType.noAns == true && this.filterType.recent == false) {
      this.loadDataWithFilter("no_answer")
    }
    else if (this.filterType.recent == false && this.filterType.noAns == false) {
      this.loadDataWithFilter("reset")
    }
    else {
      this.loadDataWithFilter("both")
    }
  }

  loadDataWithFilter(option) {
    let temp = this.tempData;
    console.log(temp)
    this.data = [];
    if (this.filterData != undefined) {
      this.filterData = []
    }
    console.log("filter with "+option)
    for (var i = 0; i < temp.length; i++) {
      //console.log(temp[i].date_post)
      var date = parseInt(this.countDate(temp[i].date_post))
      if (option == "recent") {
        if (date < 20) {
          this.filterData.push(temp[i])
        }
      } else if (option == "no_answer") {
        if (temp[i].isAnswer == false ) {
          this.filterData.push(temp[i])
        }
      } else if (option == "both") {
        if (date < 20 && temp[i].isAnswer == false) {
          this.filterData.push(temp[i])
        }
      }
    }
    if(this.filterData.length ==0){
      this.noFound = true;
    }
    if (option == "reset") {
      //console.log(this.tempData)
      this.data = this.tempData
      this.noFound=false
    } else {
      this.data = this.filterData
    }
    console.log(this.filterData)
  }

  reset(){
    if(this.filterType.recent == false && this.filterType.noAns == false){
      this.data = this.tempData
      this.noFound = false
    } 
    this.filter = false
   
  }

  getInnerHtml(html) {
    console.log(html)
    return document.getElementById("description").innerHTML = html;
  }

  getCategory() {
    this.queryService.getQuesOnAny('categories_id',this.category_id).subscribe(result=>{
      this.questionData = result['question']
      console.log(this.questionData)
      this.data = this.questionData.filter(q => {
        if (q.categories_id == this.category_id) {
          //console.log(q)
          return q
        }
      })
      this.tempData = this.data
      console.log(this.data)
    })



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
    //console.log( moment.unix(value).fromNow())
    // if (value.length <= 10) {
    //   return moment.unix(value).fromNow()
    // }
    // else {
    //   return moment.unix(value / 1000).fromNow()
    // }
    return moment(value).fromNow()

  }

}
