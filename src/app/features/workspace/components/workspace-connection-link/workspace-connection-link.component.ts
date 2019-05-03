import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { HeirarchyNodeWithLink } from '../../interfaces/NodeType';

@Component({
  selector: 'app-workspace-connection-link',
  templateUrl: './workspace-connection-link.component.html',
  styleUrls: ['./workspace-connection-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceConnectionLinkComponent implements OnInit {
  @Input() origin: HeirarchyNodeWithLink;
  @Input() link: HeirarchyNodeWithLink;

  distance = 0;
  left = 0;
  width = 0;
  height = 60;

  path = '';

  constructor() {}

  ngOnInit() {
    if (this.link.childParent) {
      this.origin = this.link.childParent;
    }

    this.distance = this.link.left - this.origin.left;
    this.width = Math.abs(this.distance + 20);

    this.generateLink();
  }

  generateLink() {
    const x1 = this.link.left;
    const x4 = this.origin.left;

    const y1 = this.link.top;
    const y4 = this.origin.top;

    const distance = x1 - x4;
    const height = y1 - y4;

    this.width = Math.abs(distance) + 10;

    const range = distance > 6000 ? 1.5 : 0.95;

    // M 3, 0 C 3, 32.5, {{distance}}, 0, {{distance}}, 50
    if (distance === 0) {
      this.height = Math.abs(height);
      this.path = `M 3, 0 C 3, 17.5, 3, 52.5, 3, ${this.height}`;
    } else if (distance > 0) {
      this.path = `M 3, 0 C 3, ${this.height *
        range}, ${distance}, 0, ${distance}, ${this.height}`;
    }
  }
}
