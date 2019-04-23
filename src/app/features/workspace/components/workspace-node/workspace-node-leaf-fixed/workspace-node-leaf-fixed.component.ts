import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { HeirarchyNodeWithLink, NodeType } from '../../../interfaces/NodeType';
import { ConnectionDrawService } from '../../../services/connection-draw.service';

@Component({
  selector: 'app-workspace-node-leaf-fixed',
  templateUrl: './workspace-node-leaf-fixed.component.html',
  styleUrls: ['./workspace-node-leaf-fixed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceNodeLeafFixedComponent implements OnInit {
  @Input() item: HeirarchyNodeWithLink;
  @Output() init: EventEmitter<void> = new EventEmitter();
  @Output() end: EventEmitter<void> = new EventEmitter();

  links: HeirarchyNodeWithLink[];

  getType() {
    return NodeType[this.item.data.type];
  }

  constructor(private connectionDrawService: ConnectionDrawService) {}

  ngOnInit() {
    this.links = this.item.children;
  }

  startLine(event: MouseEvent, el: HTMLElement) {
    event.preventDefault();
    this.init.next();

    this.connectionDrawService.start(this.item.id, event, {
      x: el.getBoundingClientRect().left + 10,
      y: el.getBoundingClientRect().top + 10,
    });
  }

  endLine() {
    this.end.next();
    console.log('end');
  }
}
