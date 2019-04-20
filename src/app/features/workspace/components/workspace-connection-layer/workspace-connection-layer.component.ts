import {
  Component,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';
import { ConnectionDrawService } from '../../services/connection-draw.service';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-workspace-connection-layer',
  templateUrl: './workspace-connection-layer.component.html',
  styleUrls: ['./workspace-connection-layer.component.scss'],
})
export class WorkspaceConnectionLayerComponent implements OnInit {
  width = 0;
  height = 0;
  top = 0;
  originalTop = 0;
  originalLeft = 0;
  left = 0;
  path;

  isReversed = false;

  // @HostBinding('style.zIndex')
  // get zIndex() {
  //   return this.path ? 999 : 0;
  // }

  element: HTMLElement;

  constructor(
    private el: ElementRef,
    private cd: ChangeDetectorRef,
    private connectionService: ConnectionDrawService,
  ) {}

  ngOnInit() {
    this.element = this.el.nativeElement;
    this.connectionService.activeNode.subscribe(({ id, event, location }) => {
      if (id) {
        this.listenToMousePosition();
        this.top = location.y;
        this.left = location.x;

        this.originalTop = location.y;
        this.originalLeft = location.x;
      } else {
        this.path = null;
      }
    });
  }

  listenToMousePosition() {
    fromEvent(document.body, 'mousemove')
      .pipe(takeUntil(this.connectionService.killActive))
      .subscribe(n => {
        this.width = 400;
        this.drawLink(n as MouseEvent);
      });
  }

  drawLink({ x, y }: MouseEvent) {

    const x1 = x;
    const y1 = y;

    const x4 = this.originalLeft;
    const y4 = this.originalTop;

    const distance = x1 - x4;
    const height = y1 - y4;

    this.height = Math.abs(height) + 10;
    this.width = Math.abs(distance) + 10;

    var dx = Math.abs(x4 - x1) * 0.75;

    if (distance < 0) {
      this.isReversed = true;
      this.left = this.originalLeft - Math.abs(distance);
      this.path = `M 3, ${height} C 3, ${dx * 0.25}, ${Math.abs(
        distance,
      )}, ${height * 0.75}, ${Math.abs(distance)} 0`;
    } else {
      this.isReversed = false;

      this.left = this.originalLeft;
      this.path = `M 3, 0 C ${dx * 0.25}, ${height *
        0.75}, ${distance}, ${height * 0.25}, ${distance}, ${height}`;
    }

  }
}
