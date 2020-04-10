import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { ApiDataService } from '../api-data.service';
import { Question } from '../question';
import { QuestionFrameComponent } from '../question-frame/question-frame.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(QuestionFrameComponent)
  private questionFrame:QuestionFrameComponent;
  primaryData:any=[];
  primaryData2:any=[];
  isLoaded:boolean=false;
  data:any=[];
  keysearch:any=null;
  searchData:any=[];
  advanceSearchData:any=[];
  mySubscription:any;
  isAdvSearch: Boolean=false;
  searchValue:any={
    categories_id:null,
    most_recent:false,
    no_ans:false
  };
  categoryData:any;

  constructor(private router: Router, private http:HttpClient, private queryService: ApiDataService) { 
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
   // this.loadData()
    this.loadData2()
    // $(document).ready(function(){
    // ($('.dropdown-toggle')as any).dropdown();
    // });
  }

  
  loadData() {
    // this.http.get('/api/questions').subscribe(result => {
    this.queryService.getAllQuestions().subscribe(result=>{
      this.primaryData.question = result
      console.log(this.primaryData.question)
      this.data = this.primaryData.question.filter(q => {
       var d = parseInt(this.countDate(q.date_post))
        if ( d < 20) {
          //console.log(q)
          return q
        }
      })
      console.log(this.data)
    })

  }
  loadData2() {
    // this.http.get('/api/questions').subscribe(result => {
    this.queryService.getAll('getLimitQuestions').subscribe((result:Question[]) =>{
      this.primaryData2.question = result
      console.log(this.primaryData2.question)
      this.data = this.primaryData2.question
      this.getCategory()
      // this.data = this.primaryData2.question.filter(q => {
      //  var d = parseInt(this.countDate(q.date_post))
      //   if ( d < 20) {
      //     //console.log(q)
      //     return q
      //   }
      // })
      console.log(this.data)
    })

  }
  getCategory() {
    this.queryService.getCategory().subscribe(result => {
      this.categoryData = result['categorys']
      console.log(this.categoryData)
    })

  }
  search(){
    console.log(this.keysearch)
    this.searchData = []
    if(this.keysearch !== null){
    this.queryService.search(this.keysearch).subscribe(result=>{
      console.log(result)
      this.searchData = result
      if(this.isAdvSearch == true){
        console.log(this.searchValue)
        if(this.searchValue.categories_id != "null" && this.searchValue.categories_id != null){
           if (this.searchValue.most_recent == true && this.searchValue.no_ans == false ){
            //filter categories and most recent
            console.log('c,m')
            this.searchData = this.searchData.filter(item=>{
              var d = parseInt(this.countDate(item.date_post))
              if(item.categories_id == this.searchValue.categories_id && d<10){
                return item;
              }
            })
          }else if(this.searchValue.no_ans == true && this.searchValue.most_recent == false){
            //filter categories and no ans
            console.log('c,n')
            this.searchData = this.searchData.filter(item=>{
              console.log(item.isAnswer)
              if(item.categories_id == this.searchValue.categories_id && item.isAnswer == '0'){
                return item;
              }
            })
          }else if (this.searchValue.no_ans == true && this.searchValue.most_recent == true){
            //filter all three
            console.log('c,m,n')
            this.searchData = this.searchData.filter(item=>{
              console.log(item.isAnswer)
              var d = parseInt(this.countDate(item.date_post))
              if(item.categories_id == this.searchValue.categories_id && d<10 && item.isAnswer == '0' ){
                return item;
              }
            })
          }
          else{
            //filter categories only
            console.log('c')
            this.searchData = this.searchData.filter(item=>{
              if(item.categories_id == this.searchValue.categories_id ){
                return item;
              }
            })
            console.log(this.searchData)
          }
        }else{
          if (this.searchValue.most_recent == true && this.searchValue.no_ans == false ){
            //filter categories and most recent
            console.log('m')
            this.searchData = this.searchData.filter(item=>{
              var d = parseInt(this.countDate(item.date_post))
              if(d<10){
                return item;
              }
            })
          }else if(this.searchValue.no_ans == true && this.searchValue.most_recent == false){
            //filter categories and no ans
            console.log('n')
            this.searchData = this.searchData.filter(item=>{
              if(item.isAnswer == '0'){
                return item;
              }
            })
          }else if (this.searchValue.no_ans == true && this.searchValue.most_recent == true){
            //filter two
            console.log('n,m')
            this.searchData = this.searchData.filter(item=>{
              console.log(item.isAnswer)
              var d = parseInt(this.countDate(item.date_post))
              if(d<10 && item.isAnswer == '0' ){
                return item;
              }
            })
          }
        }
      }

      document.getElementById('search_result').style.display='block';
      if(this.searchData.length == 0){
      document.getElementById('noFound').style.display='block';
      }
    })
    setTimeout(function() {
      document.getElementById('search_result').style.display='none';
      document.getElementById('noFound').style.display='none';
     }, 15000)
  }

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
  showSearch(){
    var btn = document.getElementById('isAdvSearch')
      if(btn.style.display =='none' ){
      btn.style.display ='block';
      this.isAdvSearch = true;
    }else{
      btn.style.display ='none';
      this.isAdvSearch = false;
    } 
  }


  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}
