import { AuthService } from './services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'DesafioPitang.View';
  public isLogado: boolean = false;


  constructor(private authService : AuthService
    ){
  }

  ngOnInit(): void {
    if(this.authService.currentUserValue != null){
      this.isLogado = true;
    }
  }

  onLogout(){
    this.authService.logout();
  }
}
