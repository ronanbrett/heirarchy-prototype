import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  Renderer2,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { NodePositioningService } from '../../../services/node-positioning.service';
import { NodeItem } from '../../../interfaces/NodeType';

@Component({
  selector: 'app-workspace-node-root',
  templateUrl: './workspace-node-root.component.html',
  styleUrls: ['./workspace-node-root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceNodeRootComponent implements OnInit {
  @Input() links: any;
  @Input() item: NodeItem;

  @Input() x: string;
  @Input() y: string;

  @Output() init: EventEmitter<void> = new EventEmitter();
  @Output() end: EventEmitter<void> = new EventEmitter();

  constructor(
    private positioningService: NodePositioningService,
    private renderer: Renderer2,
    private el: ElementRef,
  ) {}

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'left', this.x);
    this.renderer.setStyle(this.el.nativeElement, 'top', this.y);

    const el = this.el.nativeElement as HTMLElement;
    const location = el.getBoundingClientRect();
    this.positioningService.setPosition('id-0', { x: el.offsetLeft });
  }

  startLine(event: MouseEvent) {
    event.preventDefault();

    this.init.next();

    console.log('hi!');
  }

  dragging() {
    this.end.next();

    console.log('dragging');
  }

  endLine() {
    console.log('end');
  }
}
