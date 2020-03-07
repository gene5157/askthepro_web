import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { ApiDataService } from '../api-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  primaryData:any=[];
  isLoaded:boolean=false;
  data:any=[];
  keysearch:any=null;
  searchData:any=[];
  mySubscription:any;
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
    this.loadData()
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
  search(){
    console.log(this.keysearch)
    this.searchData = []
    document.getElementById('search_result').style.display='block';
    if(this.keysearch !== null){
    this.queryService.searchQuestions('title',this.keysearch).subscribe(result=>{
      console.log(result)
      this.searchData = result
    })
    setTimeout(function() {
      document.getElementById('search_result').style.display='none';
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


  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}
