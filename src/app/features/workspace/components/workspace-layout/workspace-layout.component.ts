import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { untilDestroyed } from '../../../../core/rxjs/takeUntilDestroyed';
import { NodePositioningService } from '../../services/node-positioning.service';

@Component({
  selector: 'app-workspace-layout',
  templateUrl: './workspace-layout.component.html',
  styleUrls: ['./workspace-layout.component.scss'],
  providers: [NodePositioningService],
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

  @HostListener('mouseup')
  onMouseUp() {
    this.cancelDraftNode();
  }

  constructor(
    public positioning: NodePositioningService,
    private sanitizer: DomSanitizer,
  ) {}

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
