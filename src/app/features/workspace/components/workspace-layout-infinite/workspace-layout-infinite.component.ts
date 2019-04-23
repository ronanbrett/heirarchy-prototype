import { Component, OnInit, HostListener } from '@angular/core';
import { NodeLayoutService } from '../../services/node-layout.service';
import { NodePositioningService } from '../../services/node-positioning.service';
import { ConnectionDrawService } from '../../services/connection-draw.service';

@Component({
  selector: 'app-workspace-layout-infinite',
  templateUrl: './workspace-layout-infinite.component.html',
  styleUrls: ['./workspace-layout-infinite.component.scss'],
  providers: [NodePositioningService, ConnectionDrawService],
})
export class WorkspaceLayoutInfiniteComponent implements OnInit {
  constructor(
    private connectionService: ConnectionDrawService,
    public layoutService: NodeLayoutService,
  ) {}

  ngOnInit() {}

  @HostListener('mouseup')
  onMouseUp() {
    this.cancelDraftNode();
    this.connectionService.end();
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
}
