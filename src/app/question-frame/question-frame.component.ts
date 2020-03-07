import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiDataService } from '../api-data.service';


@Component({
  selector: 'app-question-frame',
  templateUrl: './question-frame.component.html',
  styleUrls: ['./question-frame.component.css']
})
export class QuestionFrameComponent implements OnInit {
  primaryData = {
    isLoaded: true,
    questions: {}
  };
  data2: any;
  subloadData: any;
  categoryData:any = [];

  //teams$: Observable<any> = this.http.get('/api/teams');
  //questions: Observable<any> = this.http.get('/api/questions');

  constructor(private http: HttpClient, private queryService: ApiDataService) {

  }

  ngOnInit() {
    //console.log(this.questions)
    //console.log(this.teams$)
    this.getData2()
    this.getCategory()

  }
  getData2() {
    let t = this;
    // let data = this.questions 
    // console.log(data)
    t.subloadData = this.queryService.getAllQuestions().subscribe(result=>{
      t.primaryData.questions = JSON.parse(JSON.stringify(result))
      t.primaryData.isLoaded = true
      t.data2 = t.primaryData.questions
      console.log(t.data2)
    })

  }
  getCategory() {
    this.http.get('/api/categories').subscribe(result => {
      this.categoryData = result
      console.log(this.categoryData)
    })

  }

}
