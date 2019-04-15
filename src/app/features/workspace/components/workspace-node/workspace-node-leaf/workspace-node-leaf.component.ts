import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  Input,
} from '@angular/core';
import {
  NodePositioningService,
  NodeItem,
} from '../../../services/node-positioning.service';

@Component({
  selector: 'app-workspace-node-leaf',
  templateUrl: './workspace-node-leaf.component.html',
  styleUrls: ['./workspace-node-leaf.component.scss'],
})
export class WorkspaceNodeLeafComponent implements OnInit {
  @Input() item: NodeItem;
  @Input() links: any;
  @Output() init: EventEmitter<void> = new EventEmitter();
  @Output() end: EventEmitter<void> = new EventEmitter();

  constructor(
    private positioningService: NodePositioningService,
    private el: ElementRef,
  ) {}

  ngOnInit() {
    const el = this.el.nativeElement as HTMLElement;
    const location = el.getBoundingClientRect();
    this.positioningService.setPosition(this.item.id, { x: el.offsetLeft });
  }

  startLine(event: MouseEvent) {
    event.preventDefault();
    this.init.next();
  }

  dragging() {
    console.log('dragging');
  }

  endLine() {
    this.end.next();
    console.log('end');
  }
}
