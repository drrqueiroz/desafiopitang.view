import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarComponent } from './car.component';
import { CarFormComponent } from './car-form/car-form.component';

const routes: Routes = [
  { path: '', component: CarComponent},
  { path: 'carform', component: CarFormComponent},
  { path: 'carform/:carId', component: CarFormComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarRoutingModule { }
