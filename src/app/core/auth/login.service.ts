import { Injectable } from '@angular/core';
import { UserId } from './auth.models';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, skipWhile, catchError } from 'rxjs/operators';
import {
  SecurityControllerService,
  Permissions,
  User,
  LoginResponse
} from '../../../libs/api';
import { ErrorHandlingService } from '../errors/error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private userList: Array<UserId>;

  private _userId$: BehaviorSubject<string> = new BehaviorSubject(null);
  public userId$ = this._userId$
    .asObservable()
    .pipe(skipWhile(x => x === null || x === undefined));
  private permissions: Permissions;
  private _createAccountPermission$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(null);

  constructor(
    private errorHandler: ErrorHandlingService,
    private securityControllerService: SecurityControllerService
  ) {}

  get users(): Array<UserId> {
    if (!this.userList) {
      // first call ?
      this.userList = new Array<UserId>();
      this.securityControllerService
        .allUsersUsingGET('body')
        .pipe(catchError(err => this.errorHandler.handleError(err)))
        .subscribe(users => {
          users.forEach((user: User) => {
            const displayName = user.roles.length > 0 ? user.roles[0] : '';
            this.userList.push({ id: user.userId, displayName: displayName });
          });
          if (this.userList.length > 0) {
            this.login(this.userList[0].id);
          }
        });
    }
    return this.userList;
  }

  public login(userId: string): void {
    const req = { userId: userId };
    this.securityControllerService
      .loginUsingPOST(req)
      .pipe(catchError(err => this.errorHandler.handleError(err)))
      .subscribe((response: LoginResponse) => {
        this._userId$.next(userId);
        this.permissions = response.permissions;
      });
  }

  public getUserId(): string {
    return this._userId$.getValue();
  }

  public hasCreateAccountPermission(): boolean {
    return this.permissions ? this.permissions.createAccount : false;
  }
}
