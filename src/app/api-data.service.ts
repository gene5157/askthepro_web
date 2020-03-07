import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Question,Answer, Categories, Tag } from './question';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  
  // Handle API errors
  handleError(error: HttpErrorResponse) {
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
      .get<Categories>('api/categories')
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
  createQuestions(item): Observable<Question> {
    return this.http
      .post<Question>('api/questions',JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
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
  
