import { Injectable } from '@angular/core';
import { WorkspaceModule } from '../workspace.module';
import { AccountControllerService, Account } from 'src/libs/api';

import * as elasticlunr from 'elasticlunr';
import { tap, map, first } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class NodeAccountsService {

  accountList: Account[];

  constructor(
    private accountController: AccountControllerService
  ) { }

  getAccountList() {
    return this.accountList ? of(this.accountList) : this.accountController.allAccountsUsingGET('Carolyn Legge').pipe(tap(x => this.accountList = x));
  }

  search(searchParam: Partial<Account>) {

    const index = elasticlunr(function () {
      for (const key in searchParam) {
        if (searchParam.hasOwnProperty(key)) {
          this.addField(key);
        }
      }
      this.setRef('accountId');
    });


    return this.getAccountList().pipe(
      first(),
      map(n => {
        n.forEach((doc) => index.addDoc(doc));
        return index.search(searchParam, { bool: 'AND', expand: true });
      }),
      map(x => x.map(y => y.doc)));

  }



}
