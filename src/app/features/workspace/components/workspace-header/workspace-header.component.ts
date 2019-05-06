import { Component, OnInit } from '@angular/core';
import { IsNodesService } from 'src/app/state/is-nodes/is-nodes.service';

@Component({
  selector: 'app-workspace-header',
  templateUrl: './workspace-header.component.html',
  styleUrls: ['./workspace-header.component.scss']
})
export class WorkspaceHeaderComponent implements OnInit {
  constructor(public isNodeService: IsNodesService) {}

  ngOnInit() {}

  reset() {
    this.isNodeService.resetHistory();
  }
}
