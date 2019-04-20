import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  NodePositioningService,
} from '../../../services/node-positioning.service';
import { NodeItem } from "../../../interfaces/NodeType";
import { ConnectionDrawService } from '../../../services/connection-draw.service';

@Component({
  selector: 'app-workspace-node-leaf',
  templateUrl: './workspace-node-leaf.component.html',
  styleUrls: ['./workspace-node-leaf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceNodeLeafComponent implements OnInit {
  @Input() item: NodeItem;
  @Input() links: any;
  @Output() init: EventEmitter<void> = new EventEmitter();
  @Output() end: EventEmitter<void> = new EventEmitter();

  location: ClientRect;
  element: HTMLElement;

  constructor(
    private connectionDrawService: ConnectionDrawService,
    private positioningService: NodePositioningService,
    private el: ElementRef,
  ) {}

  ngOnInit() {
    this.element = this.el.nativeElement as HTMLElement;
    this.location = this.element.getBoundingClientRect();
    this.updatePosition();
  }

  updatePosition() {
    this.positioningService.setPosition(this.item.id, {
      x: this.element.offsetLeft,
    });
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
