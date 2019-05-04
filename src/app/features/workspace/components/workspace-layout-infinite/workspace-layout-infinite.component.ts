import { Component, OnInit, HostListener } from '@angular/core';
import { NodeLayoutService } from '../../services/node-layout.service';
import { ConnectionDrawService } from '../../services/connection-draw.service';
import { NodeType } from '../../interfaces/NodeType';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workspace-layout-infinite',
  templateUrl: './workspace-layout-infinite.component.html',
  styleUrls: ['./workspace-layout-infinite.component.scss'],
  providers: [ConnectionDrawService]
})
export class WorkspaceLayoutInfiniteComponent implements OnInit {
  activeNode = null;
  constructor(
    private connectionService: ConnectionDrawService,
    public layoutService: NodeLayoutService,
    private router: Router
  ) {}

  ngOnInit() {}

  @HostListener('window:mouseup')
  onMouseUp() {
    if (this.activeNode && this.activeNode.data.type === NodeType.empty) {
      this.openSidePanel();
    } else {
      this.cancelDraftNode();
    }
    this.connectionService.end();
  }

  setActiveNode(item) {
    this.activeNode = item;
  }

  clearActiveNode() {
    this.activeNode = null;
  }

  trackByID(index, item) {
    return item.id;
  }

  trackBySourceId(index, item) {
    return index;
    // return `${item.source.id}${item.target.id}`;
  }

  createDraftNode(id: string) {
    this.layoutService.createTempNode(id);
  }

  cancelDraftNode() {
    this.layoutService.removeTempNode();
  }

  openSidePanel() {
    this.router.navigate(['workspace', { outlets: { side: 'attach' } }], {queryParams: {
      parentId: this.activeNode.data.parent
    }});
  }
}
