import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';
import { NodeLayoutService } from '../../services/node-layout.service';
import { ConnectionDrawService } from '../../services/connection-draw.service';
import { Router } from '@angular/router';
import { ISNodeType, IsNode } from 'src/app/state/is-nodes/is-node.model';
import { HeirarchyNodeWithLink } from '../../interfaces/NodeType';
import { IsTreesQuery } from 'src/app/state/is-tree/is-tree.query';
import { TREE_INTERACTIVE_STATE } from 'src/app/state/is-tree/is-tree.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-workspace-layout-infinite',
  templateUrl: './workspace-layout-infinite.component.html',
  styleUrls: ['./workspace-layout-infinite.component.scss'],
  providers: [ConnectionDrawService],
  changeDetection: ChangeDetectionStrategy.Default
})
export class WorkspaceLayoutInfiniteComponent implements OnInit {
  activeNode = null;
  isDisabled = false;
  constructor(
    private connectionService: ConnectionDrawService,
    public layoutService: NodeLayoutService,
    private router: Router,
    private isTreeQuery: IsTreesQuery
  ) {}

  ngOnInit() {
    this.isTreeQuery.selectTreeInteractivity$.subscribe(treeInteractive => {
      this.isDisabled = treeInteractive === TREE_INTERACTIVE_STATE.DISABLED;
    });
  }

  drop($event: CdkDragDrop<HeirarchyNodeWithLink>) {
    const fromNode = $event.item.data;
    const toNode = $event.container.data.value;
    this.openMovePanel(fromNode, toNode);
    console.log(fromNode, toNode);
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.connectionService.end();
    if (this.isDisabled) {
      return;
    }

    if (this.activeNode && this.activeNode.data.type === ISNodeType.draft) {
      this.openAttachPanel();
    } else {
      this.cancelDraftNode();
    }
  }

  expandItem(id: string) {
    this.layoutService.expandNode(id);
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
  }

  createDraftNode(id: string) {
    if (this.isDisabled) {
      return;
    }
    this.layoutService.createTempNode(id);
  }

  cancelDraftNode() {
    if (this.isDisabled) {
      return;
    }
    this.layoutService.removeTempNode();
  }

  openNode(item: HeirarchyNodeWithLink) {
    if (this.isDisabled) {
      return;
    }
    this.router.navigate(['workspace', { outlets: { endside: 'view' } }], {
      queryParams: {
        id: item.id
      }
    });
  }

  openAttachPanel() {
    let parent = null;

    if (
      this.activeNode.data.type === ISNodeType.child ||
      this.activeNode.data.type === ISNodeType.draft
    ) {
      parent = this.getFirstNonChildTypeParentId(this.activeNode);
    } else {
      parent = this.activeNode.data.parent;
    }

    this.router.navigate(['workspace', { outlets: { endside: 'attach' } }], {
      queryParams: {
        parentId: parent
      }
    });
  }

  openMovePanel(
    fromNode: HeirarchyNodeWithLink,
    toNode: HeirarchyNodeWithLink
  ) {
    const parentId = this.getFirstNonChildTypeParentId(toNode);

    this.router.navigate(['workspace', { outlets: { endside: 'move' } }], {
      queryParams: {
        fromNode: fromNode.id,
        toNode: parentId
      }
    });
  }

  getFirstNonChildTypeParentId(node: any) {
    if (
      node.data.type !== ISNodeType.child &&
      node.data.type !== ISNodeType.draft
    ) {
      return node.data.id;
    } else {
      return this.getFirstNonChildTypeParentId(node.parent);
    }
  }
}
