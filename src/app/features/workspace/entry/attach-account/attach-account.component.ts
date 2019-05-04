import { Component, OnInit } from '@angular/core';
import { QueryField } from '../../../../core/components/query-search/query-search.consts';
import { SyntaxKind } from '../../../../core/components/lexer/scanner.interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { NodeLayoutService } from '../../services/node-layout.service';

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
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(({ parentId }) => {
      if (!parentId) {
        this.close();
      }
      this.parentId = parentId;
    });
  }

  addNode() {
    if (!this.parentId) {
      throw new Error('Missing Parent ID');
    }
    this.nodeLayoutService.confirmNode(this.parentId);
  }

  close() {
    console.log(this.activatedRoute);
    this.router.navigate(
      [
        {
          outlets: {
            side: null
          }
        }
      ],
      {
        relativeTo: this.activatedRoute.parent // <--- PARENT activated route.
      }
    );
  }
}
