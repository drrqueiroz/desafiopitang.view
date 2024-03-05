import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable, Subject, catchError, switchMap, take } from 'rxjs';
import { Users } from '../models/user';
import { UsersService } from '../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  preserveWhitespaces : true
})
export class UserComponent implements OnInit {

  users$: Observable<Users[]>;

  userSelecionado: Users;

  constructor(
    private service: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.onRefresh();
  }

  onRefresh() {
    this.users$ = this.service.getAllUsers().pipe(
      catchError(error => {
        console.error(error);
        alert(error);
        return EMPTY;
      })
    );
  }


  onEdit(id : Number) {
    this.router.navigate(['userform', id], { relativeTo: this.route });
  }

  onDelete(user : Users) {
    this.service.excluir(user)
    .subscribe(
      success => {
        this.onRefresh();
      },
      error => {
       console.log(error);
       alert(error);
      }
    );
  }

}
