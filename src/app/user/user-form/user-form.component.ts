import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Users } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  preserveWhitespaces : true
})
export class UserFormComponent implements OnInit, OnDestroy {

  public userForm: FormGroup;
  private subscription: Subscription[] = [];
  private objUser : Users;
  public isUpdate : boolean = false;


  constructor(private formBuilder: FormBuilder,
    private usersService : UsersService,
    private router : Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription.push(this.route.params.subscribe((params: any) => {
      var userId : number = params['userId'];
      if (userId != null) {
        setTimeout(() => {
        }, 0);
        this.isUpdate = true;
        this.carregarPagina(userId);
      }
    }));

    if(!this.isUpdate){
      this.userForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required]],
        birthday: ['', Validators.required],
        login: ['', Validators.required],
        password: ['', [Validators.required]],
        phone: ['', Validators.required]
      });
    }else{
      this.userForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required]],
        birthday: ['', Validators.required],
        login: [''],
        password: ['', [Validators.required]],
        phone: ['', Validators.required]
      });
    }
  }

  ngOnDestroy (): void {
    this.subscription.forEach(s => { s.unsubscribe() });
  }

  /**
   *
   * @param userId
   */
  private carregarPagina(userId : number){
    this.usersService.getUserById(userId).subscribe(async (user: Users)  =>{
      this.objUser = user;
      this.userForm.get('firstName')?.setValue(user.firstName);
      this.userForm.get('lastName')?.setValue(user.lastName);
      this.userForm.get('email')?.setValue(user.email);
      this.userForm.get('birthday')?.setValue(user.birthday);
      this.userForm.get('phone')?.setValue(user.phone);
    })

  }

  /**
   *
   */
  onSubmit(){
    if(this.objUser == null){
      this.objUser = new Users();
    }

    this.objUser.firstName =  this.userForm.get('firstName')?.value;
    this.objUser.lastName =  this.userForm.get('lastName')?.value;
    this.objUser.email =  this.userForm.get('email')?.value;
    this.objUser.birthday =  this.userForm.get('birthday')?.value;
    if(!this.isUpdate){
      this.objUser.login =  this.userForm.get('login')?.value;
    }
    this.objUser.password =  this.userForm.get('password')?.value;
    this.objUser.phone =  this.userForm.get('phone')?.value;

    if (this.objUser.id !== 0) {
      this.subscription.push(this.usersService.update(this.objUser.id, this.objUser).subscribe((data) =>{
        alert('Usuário Atualizado com Sucesso');
      }, error => {
        alert(error);
      }));

    }else{
      this.subscription.push(this.usersService.inserir(this.objUser).subscribe((data) =>{
        alert('Usuário Salvo com Sucesso');
      }, error => {
        alert(error);
      }));
    }

  }

  onVoltar(){
    this.router.navigate(['/user']);
  }



  /**
   *
   * @param data
   * @returns
   */
  private convertDataToString(data: Date | undefined): String {
    const datepipe: DatePipe = new DatePipe('en-US');
    let dataConvertida = datepipe.transform(data, 'dd/MM/yyyy');

    if (dataConvertida == null) {
      return "";
    }
    return dataConvertida;
  }


}
