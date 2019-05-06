import { Component, OnInit } from '@angular/core';
import { IsTreesQuery } from 'src/app/state/is-tree/is-tree.query';
import { Observable } from 'rxjs';
import { IsTree } from 'src/app/state/is-tree/is-tree.model';
import { IsNodesService } from 'src/app/state/is-nodes/is-nodes.service';
import { tap } from 'rxjs/operators';
import { IsTreeService } from 'src/app/state/is-tree/is-tree.service';

@Component({
  selector: 'app-workspace-history',
  templateUrl: './workspace-history.component.html',
  styleUrls: ['./workspace-history.component.scss']
})
export class WorkspaceHistoryComponent implements OnInit {
  trees: Observable<IsTree[]>;
  activeID = null;

  ultimateStartDate = null;
  ultimateEndDate = null;

  constructor(
    private isNodeService: IsNodesService,
    private isTreeQuery: IsTreesQuery,
    private isTreeService: IsTreeService
  ) {}

  ngOnInit() {
    this.isTreeQuery.selectActive().subscribe(n => (this.activeID = n.key));
    this.trees = this.isTreeQuery.selectAllByTreeId('tree-1').pipe(
      tap(x => {
        this.ultimateStartDate = x[0].effectiveDateStart;
        this.ultimateEndDate = x[x.length - 1].effectiveDateEnd;
      })
    );
  }

  loadTree(tree: IsTree) {
    this.isNodeService.get();
    this.isTreeService.setActive(tree.key);
  }
}
