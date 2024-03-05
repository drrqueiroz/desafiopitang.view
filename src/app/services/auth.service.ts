import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CredentialDTO } from '../dto/credentialDTO';
import { UserLogadoViewModel } from '../viewmodel/UserLogadoViewModel';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject : BehaviorSubject<UserLogadoViewModel | null>;
  private apiUrl: string = `${environment.apiUrl}/api`;

  constructor(private httpClient: HttpClient,
              private router : Router) {

    const currentUser = localStorage.getItem('currentUser');
    if(currentUser != null){
      this.currentUserSubject = new BehaviorSubject<UserLogadoViewModel | null>(JSON.parse(currentUser));
    }
   }

   public get currentUserValue(): UserLogadoViewModel | null {
        return this.currentUserSubject?.value;
    }

    public get currentUserValueSubject(): BehaviorSubject<UserLogadoViewModel | null> {
      return this.currentUserSubject;
  }


  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8',
                               'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
                               'Access-Control-Allow-Origin': '*',
                               'Access-Control-Allow-Headers': '*',
   })
  }


  login(user: String, senha : String) : Observable<Boolean> {

    const credential : CredentialDTO = {
      login : user,
      password : senha,
    };

    return this.httpClient.post<UserLogadoViewModel>(`${this.apiUrl}/singin`, JSON.stringify(credential), this.httpOptions)
    .pipe(map((user : UserLogadoViewModel) => {

      if(user && user.Token){
        console.log(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }else{
        this.logout();
      }
      return false;
    }), catchError(this.handleError) );

  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth'])
}

   // Manipulação de erros
   handleError(error: HttpErrorResponse) {
    //console.log(error)
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
   // console.log(errorMessage);
    return throwError(error);
  };

  // Manipulação de erros
  /* handleError(error: HttpErrorResponse) : Observable<String> {
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
    let jsonObj = JSON.parse(error.error) as ErroViewModel;
    return throwError(jsonObj.message);
  }; */

}
