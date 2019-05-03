import {
  Component,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { untilDestroyed } from '../../../../core/rxjs/takeUntilDestroyed';
import { NodePositioningService } from '../../services/node-positioning.service';
import { ConnectionDrawService } from '../../services/connection-draw.service';

@Component({
  selector: 'app-workspace-layout',
  templateUrl: './workspace-layout.component.html',
  styleUrls: ['./workspace-layout.component.scss'],
  providers: [NodePositioningService, ConnectionDrawService],
})
export class WorkspaceLayoutComponent implements OnInit, OnDestroy {
  items: any;
  links: any;
  parentIndex: {};

  @Input()
  public property = 3;

  @HostBinding('style')
  private cssVariable: SafeStyle = '' + this.property;
  private cols = 0;

  @HostListener('window:mouseup')
  onMouseUp() {
    console.log('hi!');
    this.cancelDraftNode();
    this.connectionService.end();
  }

  constructor(
    private connectionService: ConnectionDrawService,
    public positioning: NodePositioningService,
    private sanitizer: DomSanitizer,
  ) {}

  trackByID(item) {
    return item.id;
  }

  ngOnInit() {
    this.positioning.heirarchy$
      .pipe(untilDestroyed(this))
      .subscribe(heirarchy => {
        this.cssVariable = this.sanitizer.bypassSecurityTrustStyle(
          `--colNum: ${heirarchy.maxCols};`,
        );
        this.cols = heirarchy.maxCols;

        this.items = heirarchy.graph;
        this.links = heirarchy.links;
      });
  }

  getItems(index: number, item) {
    if (index < this.cols) {
      return [this.items[index]];
    }

    if (
      this.items[item.col] &&
      this.items[item.col].items &&
      this.items[item.col].items[item.row - 1]
    ) {
      return this.items[item.col].items[item.row - 1];
    }
  }

  getLinks(id: string) {
    return this.links[id];
  }

  createDraftNode(id: string) {
    this.positioning.addTempNode(id);
  }

  cancelDraftNode() {
    this.positioning.removeTempNode();
  }

  public ngOnDestroy() {}
}
