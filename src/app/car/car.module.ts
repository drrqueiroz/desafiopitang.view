import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarRoutingModule } from './car-routing.module';
import { CarFormComponent } from './car-form/car-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    CarFormComponent
  ],
  imports: [
    CommonModule,
    CarRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CarModule { }
