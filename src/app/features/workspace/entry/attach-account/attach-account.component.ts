import { Component, OnInit } from '@angular/core';
import { QueryField } from '../../../../core/components/query-search/query-search.consts';
import { SyntaxKind } from '../../../../core/components/lexer/scanner.interfaces';
import { Router, ActivatedRoute } from '@angular/router';

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
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {}

  close() {
    console.log(this.activatedRoute)
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
