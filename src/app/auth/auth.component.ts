
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  preserveWhitespaces : true
})
export class AuthComponent implements OnInit {

  public loginForm : FormGroup;
  private  returnUrl: string;

  constructor(private formBuilder: FormBuilder,
    private authService : AuthService,
    private router : Router,
    private route : ActivatedRoute
    ) {
      if (this.authService.currentUserValue != null) {
        this.redirect();
      }
    }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', [Validators.required]]
    });

  }


  onLogin(){
    var user : String = this.loginForm.get('login')?.value;
    var password : String = this.loginForm.get('password')?.value;

    this.authService.login(user, password).subscribe(result => {
      if (result){
        this.redirect();
      }
    },
    error => {
      alert(error);
    });

  }

  private redirect(){
      console.log('redirecionando');
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/' || '/';

        console.log(this.returnUrl);
        console.log(this.router)
        console.log(this.router.getCurrentNavigation())
        this.router.navigate(['/car']);
       /*  if(this.returnUrl != "/"){
          this.router.navigate([this.returnUrl]);
        }
        else {
          console.log('forcado');
          this.router.navigate(['/car']);
        } */

  }

}
