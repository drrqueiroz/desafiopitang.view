import { Component, OnInit } from '@angular/core';
import { Cars } from '../models/car';
import { EMPTY, Observable, Subject, catchError } from 'rxjs';
import { CarsService } from '../services/cars.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css'],
  preserveWhitespaces : true
})
export class CarComponent implements OnInit {

  cars$: Observable<Cars[]>;

  carselecionado: Cars;

  constructor(
    private service: CarsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.onRefresh();
  }

  onRefresh() {
    this.cars$ = this.service.getAllCars().pipe(
      catchError(error => {
        console.error(error);
        alert(error);
        return EMPTY;
      })
    );
  }


  onEdit(id : Number) {
    this.router.navigate(['carform', id], { relativeTo: this.route });
  }

  onDelete(user : Cars) {
    this.service.excluir(user)
    .subscribe(
      success => {
        this.onRefresh();
        alert('Carro Deletado com Sucesso');
      },
      error => {
       console.log(error);
       alert(error);
      }
    );
  }

}
