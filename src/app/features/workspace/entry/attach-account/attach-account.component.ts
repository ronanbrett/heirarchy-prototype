import { Component, OnInit } from '@angular/core';
import { QueryField } from '../../../../core/components/query-search/query-search.consts';
import { SyntaxKind } from '../../../../core/components/lexer/scanner.interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { NodeLayoutService } from '../../services/node-layout.service';
import { IsNodesService } from 'src/app/state/is-nodes/is-nodes.service';
import { ISNodeType } from 'src/app/state/is-nodes/is-node.model';
import { IsTreeService } from 'src/app/state/is-tree/is-tree.service';
import { TREE_INTERACTIVE_STATE } from 'src/app/state/is-tree/is-tree.model';

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
      name: 'accountType',
      type: SyntaxKind.QueryToken,
      operators: ['='],
      options: ['account', 'group account', 'inactive']
    }
  ];

  links = ['and'];

  parentId: null;

  constructor(
    private nodeLayoutService: NodeLayoutService,
    private isNodeService: IsNodesService,
    private isTreeService: IsTreeService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

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
