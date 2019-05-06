import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { combineLatest } from 'rxjs';
import { IsNodesService } from 'src/app/state/is-nodes/is-nodes.service';
import { NodeLayoutService } from '../../services/node-layout.service';

@Component({
  selector: 'app-workspace-layout-test-page',
  templateUrl: './workspace-layout-test-page.component.html',
  styleUrls: ['./workspace-layout-test-page.component.scss']
})
export class WorkspaceLayoutTestPageComponent implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private nodeLayoutService: NodeLayoutService,
    private isNodeService: IsNodesService
  ) {}

  ngOnInit() {
    combineLatest(
      this.nodeLayoutService.pageHeight,
      this.nodeLayoutService.pageWidth
    ).subscribe(([height, width]) => {
      if (height && width) {
        this.renderer.setStyle(this.el.nativeElement, 'height', `${height}px`);
        this.renderer.setStyle(this.el.nativeElement, 'width', `${width}px`);
      }
    });
  }

  reset() {
    this.isNodeService.resetHistory();
  }
}
