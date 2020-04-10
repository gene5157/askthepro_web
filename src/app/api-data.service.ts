import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Question,Answer, Categories, Tag } from './question';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  baseUrl = 'http://localhost/askthepro/api';
  baseUrl2 = 'http://localhost/askthepro/includes';
  questions: Question[];
  temp:any;
  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  
  // Handle API errors
  handleError(error: HttpErrorResponse) {
    console.log(error)
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
  
  
  // // Create a new item
  // createItem(item): Observable<Student> {
  //   return this.http
  //     .post<Student>(this.base_path, JSON.stringify(item), this.httpOptions)
  //     .pipe(
  //       retry(2),
  //       catchError(this.handleError)
  //     )
  // }
  // get category
  getCategory(): Observable<Categories> {
    return this.http
      .get<Categories>(`${this.baseUrl}/phpProcess?class=api&function=getCategorys`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  getAllQuest(): Observable<Question> {
    return this.http
      .get<Question>(`${this.baseUrl}/phpProcess?class=api&function=getAllQuestions`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  getQuesOnAny(where_name,where_id): Observable<Question> {
    return this.http
      .get<Question>(`${this.baseUrl}/phpProcess?class=api&function=questionsOnAny&parameter=${where_name}&parameter2=${where_id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  getQuesCategory(user_id): Observable<Question> {
    return this.http
      .get<Question>(`${this.baseUrl}/phpProcess?class=api&function=getCategoryOnAny&parameter=${user_id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  getQuesAns(id): Observable<Question> {
    return this.http
      .get<Question>(`${this.baseUrl}/phpProcess?class=api&function=getQuestion&parameter=${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  getPoint(userId) {
    return this.http
      .get(`${this.baseUrl}/phpProcess?class=api&function=getPointOnAny&parameter=${userId}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  search(keyvalue){
    return this.http
      .get(`${this.baseUrl}/phpProcess?class=api&function=search&title=${keyvalue}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  search2(keyword): Observable<Question> {
    return this.http
    .get<Question>(`${this.baseUrl}/phpProcess?class=api&function=search&title=${keyword}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  // get tag
  getTag(): Observable<Tag> {
    return this.http
      .get<Tag>('api/tag')
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  //create question
  createQuestion(funct_name,question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.baseUrl}/phpProcess?class=api&function=${funct_name}`, { data: question })
      .pipe(
        retry(2),
      catchError(this.handleError));
  }

  //update question
  updQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.baseUrl}/phpProcess?class=api&function=updQuestion`, { data: question })
      .pipe(
        retry(2),
      catchError(this.handleError));
  }
  
  //del question
  delQuestion(id): Observable<Question> {
    return this.http.put<Question>(`${this.baseUrl}/phpProcess?class=api&function=delQuestion`, { data:id })
      .pipe(
        retry(2),
      catchError(this.handleError));
  }

  //create answer
  createAns(funct_name,ans): Observable<Answer> {
    return this.http.post<Answer>(`${this.baseUrl}/phpProcess?class=api&function=${funct_name}`, { data: ans })
      .pipe(
        retry(2),
      catchError(this.handleError));
  }

  //update answer
  updAns(answer): Observable<Answer> {
    return this.http.post<Answer>(`${this.baseUrl}/phpProcess?class=api&function=updAnswer`, { data: answer })
      .pipe(
        retry(2),
      catchError(this.handleError));
  }

  //del answer
  delAns(id): Observable<Answer> {
    return this.http.put<Answer>(`${this.baseUrl}/phpProcess?class=api&function=delAnswer`, { data:id })
      .pipe(
        retry(2),
      catchError(this.handleError));
  }

  //update answer
  updBestAns(answer): Observable<Answer> {
    return this.http.put<Answer>(`${this.baseUrl}/phpProcess?class=api&function=updBestAns`, { data: answer })
      .pipe(
        retry(2),
      catchError(this.handleError));
  }

   //create point
   createPoint(point) {
    return this.http.post(`${this.baseUrl}/phpProcess?class=api&function=addPoint`, { data: point })
      .pipe(
        retry(2),
      catchError(this.handleError));
  }

  //update point
  updPoint(point) {
    return this.http.put(`${this.baseUrl}/phpProcess?class=api&function=updPoint`, { data: point })
      .pipe(
        retry(2),
      catchError(this.handleError));
  }



  // createQuestions(item): Observable<Question> {
  //   return this.http
  //     .post<Question>('api/questions',JSON.stringify(item), this.httpOptions)
  //     .pipe(
  //       retry(2),
  //       catchError(this.handleError)
  //     )
  // }
  //submit answer for particular question
  createAnswer(item): Observable<Answer> {
    console.log(item)
    return this.http
      .post<Answer>('api/answers',JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }



  // Get all question list
  getAllQuestions(): Observable<Question> {
    return this.http
      .get<Question>('api/questions?_embed=answers')
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  getAll(functionName): Observable<Question[]> {
    return this.http.get(`${this.baseUrl}/phpProcess?class=api&function=`+functionName).pipe(
      map((res) => {
        console.log(res)
        this.questions = res['questions'];
        return this.questions;
      }),
      catchError(this.handleError));
  }
  

  // Get particular question 
  getQuestions(id): Observable<Question> {
    return this.http
      .get<Question>('api/questions/' + id + '?_embed=answers')
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  // search particular question 
  searchQuestions(keyword,value): Observable<Question> {
    return this.http
      .get<Question>('api/questions/?'+ keyword +'_like=' + value)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  //sort and order
  sortOrder(table,field,value): Observable<Question>{
    return this.http
    .get<Question>('api/'+ table + '?_sort=' + field + '&_order='+ value)
    .pipe(
      retry(2),
        catchError(this.handleError)
    )
  }

  updateQuery(id, item): Observable<Question> {
      return this.http
        .put<Question>('api/questions/' + id, JSON.stringify(item), this.httpOptions)
        .pipe(
          retry(2),
          catchError(this.handleError)
        )
    }
    //update answ
    updateAnsQuery(id, item): Observable<Question> {
      return this.http
        .patch<Question>('api/answers/' + id, JSON.stringify(item), this.httpOptions)
        .pipe(
          retry(2),
          catchError(this.handleError)
        )
    }
  
  // // Get data
  // getList(): Observable<Question> {
  //   return this.http
  //     .get<Question>(this.base_path)
  //     .pipe(
  //       retry(2),
  //       catchError(this.handleError)
  //     )
  // }
  
  // // Update item by id
  // updateItem(id, item): Observable<Question> {
  //   return this.http
  //     .put<Question>(this.base_path + '/' + id, JSON.stringify(item), this.httpOptions)
  //     .pipe(
  //       retry(2),
  //       catchError(this.handleError)
  //     )
  // }
  
  // // Delete item by id
  // deleteItem(id) {
  //   return this.http
  //     .delete<Question>(this.base_path + '/' + id, this.httpOptions)
  //     .pipe(
  //       retry(2),
  //       catchError(this.handleError)
  //     )
  // }

}
  
