import { Injectable } from '@angular/core';
import { empty } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(x: HttpErrorResponse) {
    let message;
    if (typeof x.error === 'string') {
      message = x.error;
    } else {
      message = x.statusText;
    }

    this.snackBar.open(message, null, {
      panelClass: 'snackbar-error',
      duration: 5000
    });
    return empty();
  }
}
