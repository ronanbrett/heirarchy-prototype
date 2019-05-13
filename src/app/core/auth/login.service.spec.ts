import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LoginService } from './login.service';
import { SecurityControllerService } from '../../../libs/api';

export class SecurityControllerServiceMock {
  allUsersUsingGET = of([]);
}

describe('LoginService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SecurityControllerService,
          useClass: SecurityControllerServiceMock
        }
      ]
    })
  );

  it('should be created', () => {
    const service: LoginService = TestBed.get(LoginService);
    expect(service).toBeTruthy();
  });
});
