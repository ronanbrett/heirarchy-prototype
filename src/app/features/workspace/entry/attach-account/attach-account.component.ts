import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISNodeType } from 'src/app/state/is-nodes/is-node.model';
import { IsNodesService } from 'src/app/state/is-nodes/is-nodes.service';
import { TREE_INTERACTIVE_STATE } from 'src/app/state/is-tree/is-tree.model';
import { IsTreeService } from 'src/app/state/is-tree/is-tree.service';
import { SyntaxKind } from '../../../../core/components/lexer/scanner.interfaces';
import { QueryField } from '../../../../core/components/query-search/query-search.consts';
import { NodeAccountsService } from '../../services/node-accounts.service';
import { NodeLayoutService } from '../../services/node-layout.service';
import { Account } from 'src/libs/api';

let ID = 5000;

@Component({
  selector: 'app-attach-account',
  templateUrl: './attach-account.component.html',
  styleUrls: ['./attach-account.component.scss']
})
export class AttachAccountComponent implements OnInit {
  fields: QueryField[] = [
    {
      name: 'accountId',
      type: SyntaxKind.QueryToken,
      operators: ['=']
    },
    {
      name: 'accountName',
      type: SyntaxKind.QueryToken,
      operators: ['=']
    },
    {
      name: 'fund',
      type: SyntaxKind.QueryToken,
      operators: ['=']
    },
    {
      name: 'accountType',
      type: SyntaxKind.QueryToken,
      operators: ['='],
      options: ['account', 'groupAccount']
    }
  ];

  links = ['and'];

  parentId: null;

  searchResults: Account[] = [];

  constructor(
    private nodeAccounts: NodeAccountsService,
    private nodeLayoutService: NodeLayoutService,
    private isNodeService: IsNodesService,
    private isTreeService: IsTreeService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }


  searchNodes(nsearch: Partial<Account>) {

    console.log(nsearch);
    let search = {};

    for (const key in nsearch) {
      if (nsearch.hasOwnProperty(key)) {
        const element = nsearch[key];
        search[key] = element.join(' ');
      }
    }

    this.nodeAccounts.search(search).subscribe(n => this.searchResults = n);

  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(({ parentId }) => {
      if (!parentId) {
        this.close();
      }
      this.parentId = parentId;
      this.isTreeService.updateInteractivity(TREE_INTERACTIVE_STATE.DISABLED);
    });
  }

  addNode() {
    if (!this.parentId) {
      throw new Error('Missing Parent ID');
    }
    this.isNodeService.add({
      id: `id-${ID++}`,
      parent: this.parentId,
      type: ISNodeType.child
    });

    this.close();
  }

  close(withOutAdding = false) {
    this.isTreeService.updateInteractivity(TREE_INTERACTIVE_STATE.ENABLED);

    if (withOutAdding) {
      this.nodeLayoutService.removeTempNode();
    }

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
