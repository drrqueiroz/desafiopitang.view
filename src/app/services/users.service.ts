import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Users } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl: string = `${environment.apiUrl}/api`;
  constructor(private httpClient: HttpClient) { }


  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8',
                               'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
                               'Access-Control-Allow-Origin': '*',
                               'Access-Control-Allow-Headers': '*',
   })
  }


  getAllUsers() : Observable<Users[]> {
    return this.httpClient.get<Users[]>(`${this.apiUrl}/users`).pipe(
      retry(2),
      catchError(this.handleError))
  }

  getUserById(id : number) : Observable<Users>{
    return this.httpClient.get<Users>(`${this.apiUrl}/users/${id}`).pipe(
      retry(2),
      catchError(this.handleError))
  }

  //error$ = new Subject<boolean>();
  inserir(Users : Users) : Observable<Users>  {
    return this.httpClient.post<Users>(`${this.apiUrl}/users`, JSON.stringify(Users), this.httpOptions)
    .pipe(
      retry(0),
      catchError(this.handleError))
  }

  update(id : number, user : Users) : Observable<Users>  {
    console.log(user)
    return this.httpClient.put<Users>(`${this.apiUrl}/users/${id}`, JSON.stringify(user), this.httpOptions)
    .pipe(
      retry(0),
      catchError(this.handleError))
  }

  excluir (user : Users){
    return this.httpClient.delete( `${this.apiUrl}/users/${user.id}`, this.httpOptions)
    .pipe(
      catchError(this.handleError))

  }



  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    console.log(error)
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(error);
  };

}
