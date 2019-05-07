import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { HeirarchyNodeWithLink } from '../../../interfaces/NodeType';
import { ConnectionDrawService } from '../../../services/connection-draw.service';
import { detectIE11OrLower } from '../../../../../core/compat/util.ie-detect';
import { ISNodeType } from 'src/app/state/is-nodes/is-node.model';

@Component({
  selector: 'app-workspace-node-leaf-fixed',
  templateUrl: './workspace-node-leaf-fixed.component.html',
  styleUrls: ['./workspace-node-leaf-fixed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceNodeLeafFixedComponent implements OnInit {
  @Input() item: HeirarchyNodeWithLink;
  @Output() init: EventEmitter<void> = new EventEmitter();
  @Output() end: EventEmitter<void> = new EventEmitter();

  @Output() open: EventEmitter<HeirarchyNodeWithLink> = new EventEmitter();
  @Output() expand: EventEmitter<string> = new EventEmitter();

  links: HeirarchyNodeWithLink[];

  isCollapsed = false;

  types = ISNodeType;

  type = null;

  getType() {
    return ISNodeType[this.item.data.type];
  }

  constructor(private connectionDrawService: ConnectionDrawService) {}

  ngOnInit() {
    this.links = this.item.children;
    this.type = ISNodeType[this.item.data.type];
  }

  startLine(event: MouseEvent, el: HTMLElement) {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (this.item._children) {
      return this.expand.next(this.item.id);
    }

    if (!detectIE11OrLower()) {
      this.init.next();
      this.connectionDrawService.start(this.item.id, event, {
        x: el.getBoundingClientRect().left + 10,
        y: el.getBoundingClientRect().top + 10
      });
    }
  }

  endLine() {
    this.end.next();
  }

  openNode() {
    this.open.next(this.item);
  }
}
