import { Cars } from './../models/car';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErroViewModel } from '../viewmodel/ErrorViewModel';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  private apiUrl: string = `${environment.apiUrl}/api/cars`;
  private token : String = '';
  constructor(private httpClient: HttpClient,
              private authService : AuthService,
              private router : Router,
              private route : ActivatedRoute) {
                this.token = 'Bearer ' + this.authService.currentUserValue?.Token;
              }


private httpOptions(){
  return  {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8',
                               'Authorization' : this.token + ''
                        })
  }
}


  getAllCars() : Observable<Cars[]> {
    return this.httpClient.get<Cars[]>(`${this.apiUrl}`, this.httpOptions()).pipe(
      retry(2),
      catchError(this.handleError))
  }

  getCarById(id : number) : Observable<Cars>{
    return this.httpClient.get<Cars>(`${this.apiUrl}/${id}`, this.httpOptions()).pipe(
      retry(2),
      catchError(this.handleError))
  }

  inserir(Cars : Cars) : Observable<Cars>  {
    return this.httpClient.post<Cars>(`${this.apiUrl}`, JSON.stringify(Cars), this.httpOptions())
    .pipe(
      retry(0),
      catchError(this.handleError))
  }

  update(id : number, Cars : Cars) : Observable<Cars>  {
    return this.httpClient.put<Cars>(`${this.apiUrl}/${id}`, JSON.stringify(Cars), this.httpOptions())
    .pipe(
      retry(1),
      catchError(this.handleError))
  }

  excluir (car : Cars){
    return this.httpClient.delete( `${this.apiUrl}/${car.id}`, this.httpOptions())
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
      console.log(errorMessage);

      let errorViewModel = error.error as ErroViewModel;
      if(errorViewModel != null){
        if(errorViewModel.errorCode == '401'){
            console.log('redirect')
           // this.router.navigate(['/auth']);
        }
        return throwError(errorViewModel.message);
      }

    }
    console.log(errorMessage);
    return throwError(error);
  };



}
