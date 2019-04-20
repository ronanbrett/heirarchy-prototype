import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ElementRef,
} from '@angular/core';
import { HierarchyLink } from 'd3-hierarchy';
import { fromEvent } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { untilDestroyed } from '../../../../core/rxjs/takeUntilDestroyed';
import { ConnectionDrawService } from '../../services/connection-draw.service';
import { NodePositioningService } from '../../services/node-positioning.service';

@Component({
  selector: 'app-workspace-connection',
  templateUrl: './workspace-connection.component.html',
  styleUrls: ['./workspace-connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WorkspaceConnectionComponent implements OnInit, OnDestroy {
  @Input() link: HierarchyLink<any>;

  @Input() isDrawable = false;
  @Input() id: string;
  element: HTMLElement;

  distance = 0;
  left = 0;
  width = 0;

  isReversed = false;
  path = '';

  constructor(
    private cd: ChangeDetectorRef,
    private el: ElementRef,
    private positioning: NodePositioningService,
    private connectionService: ConnectionDrawService,
  ) {}

  ngOnInit() {
    this.element = this.el.nativeElement;
    this.listenToLocation();
  }

  listenToLocation() {
    this.positioning.locations$
      .pipe(
        map(x => ({
          src: x[this.link.source.id],
          target: x[this.link.target.id],
        })),
        untilDestroyed(this),
      )
      .subscribe(n => {
        if (!n.src || !n.target) {
          return;
        }

        this.cd.detach();

        const distance = n.target.x - n.src.x;

        this.distance = distance;
        this.width = Math.abs(this.distance + 20);
        this.generateLink(distance);

        this.cd.detectChanges();
      });
  }

  generateLink(distance) {
    this.isReversed = false;
    // M 3, 0 C 3, 32.5, {{distance}}, 0, {{distance}}, 50
    if (distance === 0) {
      this.path = 'M 3, 73 C 3, 17.5, 3, 52.5, 3, 0';
    } else if (distance > 0) {
      this.path = `M 3, 0 C 3, 52.5, ${distance}, 0, ${distance}, 50`;
    } else if (distance < 0) {
      this.isReversed = true;
      //M 3, 60 C 3, -20.5, 250, 50.5, 250, -10
      this.path = `M 3, 60 C 3, -20.5, ${Math.abs(distance) +
        5}, 50.5, ${Math.abs(distance) + 5}, -10`;
      this.width = Math.abs(this.distance) + 5;
    }
  }

  ngOnDestroy() {}
}
