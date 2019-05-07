import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ISTreeLifeCycleStatus } from 'src/app/state/is-tree/is-tree.model';
import { SyntaxKind } from 'src/app/core/components/lexer/scanner.interfaces';
import { QueryField } from 'src/app/core/components/query-search/query-search.consts';

export enum VIEW_NODE_STATE {
  DEFAULT,
  MOVE,
  ATTACH
}

@Component({
  selector: 'app-view-node',
  templateUrl: './view-node.component.html',
  styleUrls: ['./view-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewNodeComponent implements OnInit {
  states = VIEW_NODE_STATE;
  state = VIEW_NODE_STATE.DEFAULT;

  fields: QueryField[] = [
    {
      name: 'accountId',
      type: SyntaxKind.QueryToken,
      operators: ['=']
    },
    {
      name: 'accountType',
      type: SyntaxKind.QueryToken,
      operators: ['='],
      options: ['account', 'group account', 'inactive']
    }
  ];

  links = ['and'];

  status = [
    ISTreeLifeCycleStatus.inactive,
    ISTreeLifeCycleStatus.preactive,
    ISTreeLifeCycleStatus.active,
    ISTreeLifeCycleStatus.expired
  ];

  statuses = ISTreeLifeCycleStatus;

  searchResults = [];

  constructor(
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {}

  setComponentState(state: VIEW_NODE_STATE) {
    this.searchResults = [];
    this.state = state;
    this.cd.detectChanges();
  }

  setSearchResults(res) {
    console.log(this.searchResults);
    this.searchResults = ['Account 1', 'Account 2'];
    this.cd.detectChanges();
  }

  close() {
    this.router.navigate(
      [
        {
          outlets: {
            endside: null
          }
        }
      ],
      {
        relativeTo: this.activatedRoute.parent // <--- PARENT activated route.
      }
    );
  }
}
