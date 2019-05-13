import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { apiBasePath } from './core.consts';
import { BASE_PATH, ApiModule } from 'src/libs/api';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule, MatNativeDateModule } from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatNativeDateModule,
    HttpClientModule,
    ApiModule
  ],
  providers: [
    { provide: BASE_PATH, useFactory: apiBasePath }
  ]
})
export class CoreModule { }
