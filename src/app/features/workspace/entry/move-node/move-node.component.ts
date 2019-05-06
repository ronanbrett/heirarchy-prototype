import { Component, OnInit } from '@angular/core';
import { IsTreeService } from 'src/app/state/is-tree/is-tree.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TREE_INTERACTIVE_STATE } from 'src/app/state/is-tree/is-tree.model';

@Component({
  selector: 'app-move-node',
  templateUrl: './move-node.component.html',
  styleUrls: ['./move-node.component.scss']
})
export class MoveNodeComponent implements OnInit {

  fromNode = null;
  toNode = null;
  constructor(
    private isTreeService: IsTreeService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(({ fromNode, toNode }) => {
      this.fromNode = fromNode;
      this.toNode = toNode;
      this.isTreeService.updateInteractivity(TREE_INTERACTIVE_STATE.DISABLED);
    });
  }

  confirm(){

  }

  close() {
    this.isTreeService.updateInteractivity(TREE_INTERACTIVE_STATE.ENABLED);

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
