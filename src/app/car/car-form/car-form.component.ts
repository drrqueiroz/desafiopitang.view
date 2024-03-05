import { preserveWhitespacesDefault } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cars } from 'src/app/models/car';
import { AuthService } from 'src/app/services/auth.service';
import { CarsService } from 'src/app/services/cars.service';

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.css'],
  preserveWhitespaces : true
})
export class CarFormComponent implements OnInit, OnDestroy {

  public carForm: FormGroup;

  private subscription: Subscription[] = [];
  private objCar : Cars;
  public isUpdate : boolean = false;

  constructor(private formBuilder: FormBuilder,
             private carService : CarsService,
             private router : Router,
              private route : ActivatedRoute,
              private authService : AuthService) { }

  ngOnInit(): void {
    this.carForm = this.formBuilder.group({
      licensePlate :['', Validators.required],
      year: [null, Validators.required],
      model: ['', Validators.required],
      color: ['', Validators.required]
    });

    this.subscription.push(this.route.params.subscribe((params: any) => {
      var carId : number = params['carId'];
      if (carId != null) {
        setTimeout(() => {
        }, 0);
        this.isUpdate = true;
        this.carregarPagina(carId);
      }
    }));
  }

  ngOnDestroy (): void {
    this.subscription.forEach(s => { s.unsubscribe() });
  }

  /**
   *
   * @param carId
   */
  private carregarPagina(carId : number){
    this.carService.getCarById(carId).subscribe(async (car: Cars)  =>{
      console.log(car);
      this.objCar = car;
      this.carForm.get('licensePlate')?.setValue(car.licensePlate);
      this.carForm.get('year')?.setValue(car.year);
      this.carForm.get('model')?.setValue(car.model);
      this.carForm.get('color')?.setValue(car.color);
    })

  }
  /**
   *
   */
  onSubmit(){
    if(this.objCar == null){
      this.objCar = new Cars();
    }
    this.objCar.licensePlate =  this.carForm.get('licensePlate')?.value;
    this.objCar.year =  this.carForm.get('year')?.value;
    this.objCar.model =  this.carForm.get('model')?.value;
    this.objCar.color =  this.carForm.get('color')?.value;

    if(this.authService.currentUserValue != null){
      this.objCar.user.id = this.authService.currentUserValue.Id;
    }

    if (this.objCar.id !== 0) {
      this.subscription.push(this.carService.update(this.objCar.id, this.objCar).subscribe((data) =>{
        alert('Carro Atualizado com Sucesso');
        this.onVoltar();
      }, error => {
        alert(error);
      }));

    }else{
      this.subscription.push(this.carService.inserir(this.objCar).subscribe((data) =>{
        alert('Carro Salvo com Sucesso');
        this.onVoltar();
      }, error => {
        alert(error);
      }));
    }

  }

  onVoltar(){
    this.router.navigate(['/car']);
  }

}
