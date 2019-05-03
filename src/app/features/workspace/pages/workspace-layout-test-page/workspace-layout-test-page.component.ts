import {
  Component,
  OnInit,
  HostBinding,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { NodeLayoutService } from '../../services/node-layout.service';
import { combineLatest } from 'rxjs';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-workspace-layout-test-page',
  templateUrl: './workspace-layout-test-page.component.html',
  styleUrls: ['./workspace-layout-test-page.component.scss'],
})
export class WorkspaceLayoutTestPageComponent implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private nodeLayoutService: NodeLayoutService,
  ) {}

  ngOnInit() {
    combineLatest(
      this.nodeLayoutService.pageHeight,
      this.nodeLayoutService.pageWidth,
    ).subscribe(([height, width]) => {
      if (height && width) {
        this.renderer.setStyle(this.el.nativeElement, 'height', `${height}px`);
        this.renderer.setStyle(this.el.nativeElement, 'width', `${width}px`);
      }
    });
  }
}
